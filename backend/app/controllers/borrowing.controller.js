const Borrowing = require('../models/borrowing.model');
const Book = require('../models/book.model');
const Reader = require('../models/reader.model'); 
const Notification = require('../models/notification.model');
const sendEmail = require('../utils/sendEmail');

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
        const borrowing = await Borrowing.findById(id);
        if (!borrowing) return res.status(404).send({ message: "Không tìm thấy phiếu mượn!" });

        if (borrowing.trangThai !== 'Chờ duyệt') {
            return res.status(400).send({ message: "Phiếu này không ở trạng thái chờ duyệt!" });
        }

        // Trừ kho
        const book = await Book.findOneAndUpdate(
            { masach: borrowing.masach, soQuyen: { $gt: 0 } }, 
            { $inc: { soQuyen: -1 } }, 
            { new: true } 
        );

        if (!book) return res.status(400).send({ message: "Sách này vừa hết hàng!" });

        // Cập nhật ngày
        let startDate = new Date();
        if (borrowing.ngayHenLay && new Date(borrowing.ngayHenLay) > startDate) {
            startDate = new Date(borrowing.ngayHenLay);
        }
        const deadline = new Date(startDate);
        deadline.setDate(startDate.getDate() + 7); 

        borrowing.ngayMuon = startDate;
        borrowing.ngayHetHan = deadline;
        borrowing.trangThai = 'Đang mượn';
        await borrowing.save();

        // Tạo thông báo trong web
        await new Notification({
            madocgia: borrowing.madocgia,
            tieuDe: "Yêu cầu được duyệt",
            noiDung: `Thủ thư đã duyệt cuốn sách ${book.tenSach}. Vui lòng đến nhận!`,
            loai: 'success'
        }).save();

        // Lấy thông tin độc giả để có email
        const reader = await Reader.findOne({ madocgia: borrowing.madocgia });
        
        if (reader && reader.email) {
            const subject = "📚 Yêu cầu mượn sách đã được DUYỆT";
            const content = `
                <h3>Xin chào ${reader.hoLot} ${reader.ten},</h3>
                <p>Yêu cầu mượn cuốn sách <b>"${book.tenSach}"</b> của bạn đã được chấp nhận.</p>
                <p>📅 <b>Hạn trả sách:</b> ${deadline.toLocaleDateString('vi-VN')}</p>
                <p>Vui lòng đến thư viện nhận sách đúng hẹn.</p>
                <hr>
                <small>Thư viện Đại học Cần Thơ</small>
            `;
            sendEmail(reader.email, subject, content);
        }
        // -----------------------------

        res.send({ message: "Duyệt thành công! Đã gửi email thông báo.", data: borrowing });

    } catch (err) {
        res.status(500).send({ message: "Lỗi khi duyệt: " + err.message });
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

        if (!borrowing) return res.status(404).send({ message: "Không tìm thấy phiếu!" });

        // Lấy tên sách để email chi tiết hơn
        const book = await Book.findOne({ masach: borrowing.masach });
        const bookName = book ? book.tenSach : borrowing.masach;

        await new Notification({
            madocgia: borrowing.madocgia,
            tieuDe: "Yêu cầu bị từ chối",
            noiDung: `Yêu cầu mượn cuốn ${bookName} đã bị từ chối.`,
            loai: 'danger' 
        }).save();

        const reader = await Reader.findOne({ madocgia: borrowing.madocgia });
        if (reader && reader.email) {
            sendEmail(
                reader.email, 
                "❌ Yêu cầu mượn sách bị TỪ CHỐI", 
                `<h3>Chào ${reader.ten},</h3>
                 <p>Rất tiếc, yêu cầu mượn cuốn sách <b>"${bookName}"</b> của bạn không được chấp nhận.</p>
                 <p>Vui lòng liên hệ thủ thư để biết thêm chi tiết hoặc chọn cuốn sách khác.</p>`
            );
        }

        res.send({ message: "Đã từ chối và gửi email.", data: borrowing });

    } catch (err) {
        res.status(500).send({ message: "Lỗi khi từ chối: " + err.message });
    }
};

exports.returnBook = async (req, res) => {
    const id = req.params.id;

    try {
        const borrowing = await Borrowing.findById(id);
        if (!borrowing) return res.status(404).send({ message: "Phiếu mượn không tồn tại!" });

        // Kiểm tra xem đã có ngày trả chưa (tránh trả 2 lần)
        if (borrowing.ngayTra) {
            return res.status(400).send({ message: "Sách này đã được trả rồi!" });
        }

        // Cộng lại số lượng sách vào kho
        const book = await Book.findOne({ masach: borrowing.masach });
        if (book) {
            book.soQuyen += 1;
            await book.save();
        }

        const ngayTraThucTe = new Date();
        borrowing.ngayTra = ngayTraThucTe; 
        
        const hanTra = new Date(borrowing.ngayHetHan);
        
        const ngayTraSoSanh = new Date(ngayTraThucTe);
        ngayTraSoSanh.setHours(0,0,0,0);
        hanTra.setHours(0,0,0,0);

        let messageThem = "";

        if (ngayTraSoSanh > hanTra) {
            borrowing.trangThai = 'Quá hạn'; 
            
            const reader = await Reader.findOne({ madocgia: borrowing.madocgia });
            
            if (reader) {
                reader.soLanTreHan = (reader.soLanTreHan || 0) + 1;
                
                if (reader.soLanTreHan >= 3) {
                    reader.trangThai = 'Bị khóa';
                    messageThem = ` Tài khoản đã bị KHÓA do vi phạm 3 lần.`;
                } else {
                    messageThem = ` Ghi nhận trễ hạn lần ${reader.soLanTreHan}/3.`;
                }
                await reader.save();

                const noiDungTB = `Bạn đã trả cuốn ${borrowing.masach} trễ hạn. Số lần vi phạm: ${reader.soLanTreHan}/3.`;
                
                const noti = new Notification({
                    madocgia: borrowing.madocgia,
                    tieuDe: "Cảnh báo trễ hạn",
                    noiDung: noiDungTB + (reader.trangThai === 'Bị khóa' ? " TÀI KHOẢN ĐÃ BỊ KHÓA." : ""),
                    loai: 'danger'
                });
                await noti.save();
            } 
        } else {
            borrowing.trangThai = 'Đã trả';
        }

        await borrowing.save();
        
        res.send({ 
            message: "Trả sách thành công!" + messageThem, 
            data: borrowing 
        });

    } catch (err) {
        console.error(err); 
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
                    
                    query.$or = [
                        { trangThai: 'Quá hạn' }, 
                        { 
                            trangThai: 'Đang mượn', 
                            ngayHetHan: { $lt: today }
                        }
                    ];
                    break;

                case 'Đang mượn':
                    query.trangThai = 'Đang mượn';
                    break;

                default:
                    if (status) query.trangThai = status;
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