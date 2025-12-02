const Borrowing = require('../models/borrowing.model');
const Book = require('../models/book.model');
const Reader = require('../models/reader.model');
const Notification = require('../models/notification.model');

exports.create = async (req, res) => {
    if (!req.body.madocgia || !req.body.masach || !req.body.ngayHenLay) {
        return res.status(400).send({ message: "Vui lòng chọn sách và ngày hẹn lấy!" });
    }

    try {
        const reader = await Reader.findOne({ madocgia: req.body.madocgia });
        const book = await Book.findOne({ masach: req.body.masach });
        
        if (!reader || !book) return res.status(404).send({ message: "Độc giả hoặc Sách không tồn tại!" });

        if (!reader.dienThoai || !reader.diaChi) {
            return res.status(400).send({ 
                message: "Vui lòng cập nhật đầy đủ thông tin (Số điện thoại & Địa chỉ) trong trang Hồ sơ trước khi mượn sách!" 
            });
        }

        if (book.soQuyen < 1) {
            return res.status(400).send({ message: "Sách này đã hết hàng!" });
        }

        const existingBorrow = await Borrowing.findOne({ 
            madocgia: req.body.madocgia, 
            masach: req.body.masach, 
            trangThai: { $in: ['Chờ duyệt', 'Đang mượn'] } 
        });

        if (existingBorrow) {
            return res.status(400).send({ message: "Độc giả đang mượn hoặc đang chờ duyệt cuốn sách này rồi!" });
        }
        
        const count = await Borrowing.countDocuments({
            madocgia: req.body.madocgia,
            trangThai: { $in: ['Chờ duyệt', 'Đang mượn'] }
        });

        if (count >= 3) {
            return res.status(400).send({ message: "Bạn chỉ được mượn tối đa 3 cuốn sách cùng lúc!" });
        }

        const ngayHen = new Date(req.body.ngayHenLay);
        const homNay = new Date();
        homNay.setHours(0,0,0,0); 
        
        if (ngayHen < homNay) {
             return res.status(400).send({ message: "Ngày hẹn lấy không được ở trong quá khứ!" });
        }

        const borrowing = new Borrowing({
            madocgia: req.body.madocgia,
            masach: req.body.masach,
            ngayHenLay: ngayHen 
        });

        const data = await borrowing.save();
        res.send({ message: "Đã gửi yêu cầu mượn sách, vui lòng chờ duyệt.", data: data });

    } catch (err) {
        res.status(500).send({ message: err.message || "Lỗi khi tạo phiếu mượn." });
    }
};

exports.approve = async (req, res) => {
    const id = req.params.id; 
    try {
        // 1. Tìm phiếu mượn
        const borrowing = await Borrowing.findById(id);
        if (!borrowing) return res.status(404).send({ message: "Không tìm thấy phiếu mượn!" });

        if (borrowing.trangThai !== 'Chờ duyệt') {
            return res.status(400).send({ message: "Phiếu này không ở trạng thái chờ duyệt!" });
        }

        // 2. KIỂM TRA VÀ TRỪ KHO (ATOMIC UPDATE)
        // Tìm sách có mã này VÀ số lượng > 0. Nếu tìm thấy thì trừ đi 1.
        const book = await Book.findOneAndUpdate(
            { masach: borrowing.masach, soQuyen: { $gt: 0 } }, 
            { $inc: { soQuyen: -1 } }, 
            { new: true } 
        );

        // 3. Nếu không tìm thấy book (tức là soQuyen đã = 0 hoặc sách bị xóa)
        if (!book) {
            return res.status(400).send({ message: "Sách này vừa hết hàng! Không thể duyệt." });
        }

        // 4. Cập nhật phiếu mượn
        let startDate = new Date();
        // Nếu ngày hẹn là tương lai thì lấy ngày hẹn, ngược lại lấy hôm nay
        if (borrowing.ngayHenLay && new Date(borrowing.ngayHenLay) > startDate) {
            startDate = new Date(borrowing.ngayHenLay);
        }

        const deadline = new Date(startDate);
        deadline.setDate(startDate.getDate() + 7); // Mượn 7 ngày

        borrowing.ngayMuon = startDate;
        borrowing.ngayHetHan = deadline;
        borrowing.trangThai = 'Đang mượn';
        
        await borrowing.save();

        // 5. Tạo thông báo
        const noti = new Notification({
            madocgia: borrowing.madocgia,
            tieuDe: "Yêu cầu mượn sách được duyệt",
            noiDung: `Thủ thư đã duyệt cuốn sách mã ${borrowing.masach}. Vui lòng đến nhận sách!`,
            loai: 'success'
        });
        await noti.save();

        res.send({ message: "Duyệt thành công! Đã trừ kho.", data: borrowing });

    } catch (err) {
        res.status(500).send({ message: "Lỗi khi duyệt: " + err.message });
    }
};

exports.returnBook = async (req, res) => {
    const id = req.params.id;

    try {
        const borrowing = await Borrowing.findById(id);
        if (!borrowing) return res.status(404).send({ message: "Phiếu mượn không tồn tại!" });

        if (borrowing.trangThai === 'Đã trả') {
            return res.status(400).send({ message: "Sách này đã trả rồi!" });
        }

        const book = await Book.findOne({ masach: borrowing.masach });
        if (book) {
            book.soQuyen += 1;
            await book.save();
        }

        const ngayTraThucTe = new Date();
        borrowing.ngayTra = ngayTraThucTe;
        borrowing.trangThai = 'Đã trả';

        const hanTra = new Date(borrowing.ngayHetHan);
        ngayTraThucTe.setHours(0,0,0,0);
        hanTra.setHours(0,0,0,0);

        let messageThem = "";

        if (ngayTraThucTe > hanTra) {
            const reader = await Reader.findOne({ madocgia: borrowing.madocgia });
            
            if (reader) {
                reader.soLanTreHan = (reader.soLanTreHan || 0) + 1;

                if (reader.soLanTreHan >= 3) {
                    reader.trangThai = 'Bị khóa';
                    messageThem = ` Tài khoản độc giả đã bị KHÓA TỰ ĐỘNG do trễ hạn quá 3 lần (${reader.soLanTreHan}/3).`;
                } else {
                    messageThem = ` Đã ghi nhận trễ hạn lần thứ ${reader.soLanTreHan}/3.`;
                }
                
                await reader.save();
            }

            const noti = new Notification({
                madocgia: borrowing.madocgia,
                tieuDe: "Cảnh báo trễ hạn",
                noiDung: `Bạn đã trả cuốn ${borrowing.masach} trễ hạn. Số lần vi phạm hiện tại: ${reader.soLanTreHan}/3.`,
                loai: 'danger'
            });
            
            if (reader.trangThai === 'Bị khóa') {
                noti.noiDung += " TÀI KHOẢN ĐÃ BỊ KHÓA DO VI PHẠM QUÁ MỨC.";
            }
            await noti.save();
        }

        await borrowing.save();
        
        res.send({ 
            message: "Trả sách thành công!" + messageThem, 
            data: borrowing 
        });

    } catch (err) {
        res.status(500).send({ message: "Lỗi khi trả sách: " + err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};

        if (req.query.q) {
            query.madocgia = { $regex: req.query.q, $options: 'i' };
        }

        if (req.query.trangThai) {
            const status = req.query.trangThai;

            switch (status) {
                case 'Quá hạn':
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); 
                    
                    query.trangThai = 'Đang mượn';
                    query.ngayHetHan = { $lt: today };
                    break;

                case 'Đang mượn':
                    query.trangThai = 'Đang mượn';
                    break;

                case 'Chờ duyệt':
                    query.trangThai = 'Chờ duyệt';
                    break;

                case 'Đã trả':
                    query.trangThai = 'Đã trả';
                    break;
                
                default:
                    query.trangThai = status;
                    break;
            }
        }
        
        if (req.query.madocgia) {
            query.madocgia = req.query.madocgia;
        }

        const [borrowings, total] = await Promise.all([
            Borrowing.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Borrowing.countDocuments(query)
        ]);

        res.send({
            borrowings,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Lỗi lấy danh sách: " + err.message });
    }
};

exports.renew = async (req, res) => {
    const id = req.params.id;

    try {
        const borrowing = await Borrowing.findById(id);
        if (!borrowing) {
            return res.status(404).send({ message: "Không tìm thấy phiếu mượn!" });
        }

        if (borrowing.soLanGiaHan >= 1) {
            return res.status(400).send({ message: "Sách này đã gia hạn rồi, không thể gia hạn thêm!" });
        }

        if (borrowing.trangThai !== 'Đang mượn') {
             return res.status(400).send({ message: "Sách đã trả, không thể gia hạn!" });
        }

        const newDeadline = new Date(borrowing.ngayHetHan);
        newDeadline.setDate(newDeadline.getDate() + 7);

        borrowing.ngayHetHan = newDeadline;
        borrowing.soLanGiaHan += 1; 

        const data = await borrowing.save();
        res.send({ message: "Gia hạn thành công!", data: data });

    } catch (err) {
        res.status(500).send({ message: "Lỗi khi gia hạn sách." });
    }
};


exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Borrowing.findById(id);
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy phiếu mượn id=" + id });
        }
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi tìm phiếu mượn id=" + id });
    }
};

exports.reject = async (req, res) => {
    const id = req.params.id; 
    try {
        const borrowing = await Borrowing.findByIdAndUpdate(
            id, 
            { trangThai: 'Đã hủy' }, 
            { new: true }
        );

        if (!borrowing) {
            return res.status(404).send({ message: "Không tìm thấy phiếu mượn!" });
        }

        const noti = new Notification({
            madocgia: borrowing.madocgia,
            tieuDe: "Yêu cầu mượn sách bị từ chối",
            noiDung: `Yêu cầu mượn cuốn sách có mã ${borrowing.masach} của bạn đã bị từ chối. Vui lòng liên hệ thủ thư nếu có thắc mắc.`,
            loai: 'danger' 
        });
        await noti.save();

        res.send({ message: "Đã từ chối yêu cầu mượn sách.", data: borrowing });

    } catch (err) {
        res.status(500).send({ message: "Lỗi khi từ chối: " + err.message });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Borrowing.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy phiếu mượn để xóa id=" + id });
        }
        res.send({ message: "Xóa thành công!" });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi xóa id=" + id });
    }
};