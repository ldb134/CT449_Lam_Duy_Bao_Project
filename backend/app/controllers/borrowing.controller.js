const Borrowing = require('../models/borrowing.model');
const Book = require('../models/book.model');
const Reader = require('../models/reader.model'); 
const Notification = require('../models/notification.model');
const sendEmail = require('../utils/sendEmail');
const Transaction = require('../models/transaction.model'); 


const logTransaction = async (phieuId, msnv, madocgia, action, note = '') => {
    try {
        await Transaction.create({
            phieuMuonId: phieuId,
            nhanVienId: msnv || 'SYSTEM',
            madocgia: madocgia || 'UNKNOWN',
            hanhDong: action,
            ghiChu: note
        });
    } catch (e) {
        console.error("Lỗi ghi nhật ký:", e.message);
    }
};

exports.create = async (req, res) => {
    if (!req.body.madocgia || !req.body.masach || !req.body.ngayHenLay) {
        return res.status(400).send({ message: "Vui lòng chọn sách và ngày hẹn lấy!" });
    }

    try {
        const reader = await Reader.findOne({ madocgia: req.body.madocgia });
        const book = await Book.findOne({ masach: req.body.masach });
        
        if (!reader || !book) return res.status(404).send({ message: "Độc giả hoặc Sách không tồn tại!" });

        if (!reader.dienThoai || !reader.diaChi) {
            return res.status(400).send({ message: "Vui lòng cập nhật thông tin cá nhân trước khi mượn sách!" });
        }

        if (book.soQuyen < 1) {
            return res.status(400).send({ message: "Sách này đã hết hàng!" });
        }

        const count = await Borrowing.countDocuments({
            madocgia: req.body.madocgia,
            trangThai: { $in: ['Chờ duyệt', 'Đang mượn', 'Quá hạn'] }
        });

        if (count >= 3) {
            return res.status(400).send({ message: "Bạn chỉ được mượn tối đa 3 cuốn sách!" });
        }

        const borrowing = new Borrowing({
            madocgia: req.body.madocgia,
            masach: req.body.masach,
            ngayHenLay: new Date(req.body.ngayHenLay)
        });

        const data = await borrowing.save();
        res.send({ message: "Gửi yêu cầu thành công!", data: data });

    } catch (err) {
        res.status(500).send({ message: err.message });
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

        const book = await Book.findOneAndUpdate(
            { masach: borrowing.masach, soQuyen: { $gt: 0 } }, 
            { $inc: { soQuyen: -1 } }, 
            { new: true } 
        );

        if (!book) return res.status(400).send({ message: "Sách này vừa hết hàng!" });

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

        await logTransaction(borrowing._id, req.user.msnv, borrowing.madocgia, 'DUYET', `Duyệt mượn sách "${book.tenSach}"`);

        await new Notification({
            madocgia: borrowing.madocgia,
            tieuDe: "Yêu cầu được duyệt",
            noiDung: `Thủ thư đã duyệt cuốn sách ${book.tenSach}.`,
            loai: 'success'
        }).save();

        const reader = await Reader.findOne({ madocgia: borrowing.madocgia });
        if (reader && reader.email) {
            const subject = "📚 Yêu cầu mượn sách đã được DUYỆT";
            const content = `
                <h3>Xin chào ${reader.hoLot} ${reader.ten},</h3>
                <p>Yêu cầu mượn cuốn sách <b>"${book.tenSach}"</b> của bạn đã được chấp nhận.</p>
                <p>📅 <b>Ngày nhận sách:</b> ${startDate.toLocaleDateString('vi-VN')}</p>
                <p>⏳ <b>Hạn trả sách:</b> ${deadline.toLocaleDateString('vi-VN')}</p>
                <hr><small>Thư viện Đại học Cần Thơ</small>
            `;
            sendEmail(reader.email, subject, content);
        }

        res.send({ message: "Duyệt thành công!", data: borrowing });

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

        try {
            const book = await Book.findOne({ masach: borrowing.masach });
            const bookName = book ? book.tenSach : borrowing.masach;
            
            const msnv = req.user ? req.user.msnv : 'SYSTEM';

            await logTransaction(borrowing._id, msnv, borrowing.madocgia, 'TU_CHOI', `Từ chối mượn sách "${bookName}"`);

            await new Notification({
                madocgia: borrowing.madocgia,
                tieuDe: "Yêu cầu bị từ chối",
                noiDung: `Yêu cầu mượn cuốn "${bookName}" đã bị từ chối.`,
                loai: 'danger' 
            }).save();

            const reader = await Reader.findOne({ madocgia: borrowing.madocgia });
            if (reader && reader.email) {
                const subject = "❌ Yêu cầu mượn sách bị TỪ CHỐI";
                const content = `
                    <h3>Xin chào ${reader.hoLot} ${reader.ten},</h3>
                    <p>Rất tiếc, yêu cầu mượn cuốn sách <b>"${bookName}"</b> của bạn không được chấp nhận.</p>
                    <p>Vui lòng liên hệ thủ thư để biết thêm chi tiết hoặc chọn cuốn sách khác.</p>
                    <hr>
                    <small>Thư viện Đại học Cần Thơ</small>
                `;
                await sendEmail(reader.email, subject, content);
            }

             res.send({ message: "Đã từ chối yêu cầu.", data: borrowing });

    } catch (subError) {
            console.error("Lỗi phụ khi từ chối (Log/Noti):", subError.message);
        }

        res.send({ message: "Đã từ chối yêu cầu.", data: borrowing });

    } catch (err) {
        console.error("Lỗi chính:", err);
        res.status(500).send({ message: "Lỗi khi từ chối: " + err.message });
    }
};

exports.returnBook = async (req, res) => {
    const id = req.params.id;
    try {
        const borrowing = await Borrowing.findById(id);
        if (!borrowing) return res.status(404).send({ message: "Phiếu mượn không tồn tại!" });
        if (borrowing.ngayTra) return res.status(400).send({ message: "Sách này đã được trả rồi!" });

        const book = await Book.findOne({ masach: borrowing.masach });
        if (book) { book.soQuyen += 1; await book.save(); }
        
        const bookName = book ? book.tenSach : borrowing.masach;
        const ngayTraThucTe = new Date();
        borrowing.ngayTra = ngayTraThucTe;
        
        const hanTra = new Date(borrowing.ngayHetHan);
        const compareTra = new Date(ngayTraThucTe); compareTra.setHours(0,0,0,0);
        const compareHan = new Date(hanTra); compareHan.setHours(0,0,0,0);

        let messageThem = "";
        let logNote = `Trả sách "${bookName}" đúng hạn`;
        let isLate = false;

        if (compareTra > compareHan) {
            borrowing.trangThai = 'Quá hạn'; 
            logNote = `Trả sách "${bookName}" TRỄ HẠN`;
            isLate = true;
        } else {
            borrowing.trangThai = 'Đã trả';
        }
        await borrowing.save();

        const msnv = req.user ? req.user.msnv : 'SYSTEM';
        await logTransaction(borrowing._id, msnv, borrowing.madocgia, 'TRA_SACH', logNote);

        if (isLate) {
            const reader = await Reader.findOne({ madocgia: borrowing.madocgia });
            if (reader) {
                reader.soLanTreHan = (reader.soLanTreHan || 0) + 1;
                if (reader.soLanTreHan >= 3) {
                    reader.trangThai = 'Bị khóa';
                    messageThem = " Tài khoản đã bị KHÓA.";
                }
                await reader.save();
                await new Notification({
                    madocgia: borrowing.madocgia,
                    tieuDe: "Cảnh báo trễ hạn",
                    noiDung: `Bạn đã trả cuốn "${bookName}" trễ hạn. ${messageThem}`,
                    loai: 'danger'
                }).save();
            }
        }
        res.send({ message: "Trả sách thành công!" + messageThem, data: borrowing });
    } catch (err) { res.status(500).send({ message: "Lỗi khi trả sách: " + err.message }); }
};

exports.findAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let query = {};
        if (req.query.q) query.madocgia = { $regex: req.query.q, $options: 'i' };
        if (req.query.trangThai) {
            const status = req.query.trangThai;
            if (status === 'Quá hạn') {
                const today = new Date(); today.setHours(0,0,0,0);
                query.$or = [{ trangThai: 'Quá hạn' }, { trangThai: 'Đang mượn', ngayHetHan: { $lt: today } }];
            } else if (status === 'Đang mượn') { query.trangThai = 'Đang mượn'; }
            else { if (status) query.trangThai = status; }
        }
        if (req.query.madocgia) query.madocgia = req.query.madocgia;

        const [borrowings, total] = await Promise.all([
            Borrowing.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Borrowing.countDocuments(query)
        ]);
        res.send({ borrowings, currentPage: page, totalPages: Math.ceil(total / limit), totalItems: total });
    } catch (err) { res.status(500).send({ message: "Lỗi lấy danh sách: " + err.message }); }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Borrowing.findById(id);
        if (!data) return res.status(404).send({ message: "Không tìm thấy phiếu mượn" });
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Lỗi: " + err.message });
    }
};


exports.renew = async (req, res) => {
    const id = req.params.id;
    try {
        const borrowing = await Borrowing.findById(id);
        if (!borrowing) return res.status(404).send({ message: "Không tìm thấy phiếu!" });
        if (borrowing.soLanGiaHan >= 1) return res.status(400).send({ message: "Đã gia hạn rồi!" });
        if (borrowing.trangThai !== 'Đang mượn') return res.status(400).send({ message: "Không thể gia hạn!" });

        const book = await Book.findOne({ masach: borrowing.masach });
        const bookName = book ? book.tenSach : borrowing.masach;

        const newDeadline = new Date(borrowing.ngayHetHan);
        newDeadline.setDate(newDeadline.getDate() + 7);
        borrowing.ngayHetHan = newDeadline;
        borrowing.soLanGiaHan += 1; 
        await borrowing.save();

        const actor = (req.user && req.user.msnv) ? req.user.msnv : (req.user ? 'USER' : 'SYSTEM');
        
        await logTransaction(borrowing._id, actor, borrowing.madocgia, 'GIA_HAN', `Gia hạn sách "${bookName}" thêm 7 ngày`);

        res.send({ message: "Gia hạn thành công!", data: borrowing });
    } catch (err) { res.status(500).send({ message: "Lỗi gia hạn: " + err.message }); }
};


exports.delete = async (req, res) => { 
    try {
        const data = await Borrowing.findByIdAndDelete(req.params.id);
        if (!data) return res.status(404).send({ message: "Không tìm thấy để xóa!" });
        res.send({ message: "Xóa thành công!" });
    } catch (err) { res.status(500).send({ message: "Lỗi xóa: " + err.message }); }
};