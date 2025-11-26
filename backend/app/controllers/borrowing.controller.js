const Borrowing = require('../models/borrowing.model');
const Book = require('../models/book.model');
const Reader = require('../models/reader.model');

exports.create = async (req, res) => {
    if (!req.body.madocgia || !req.body.masach || !req.body.ngayHenLay) {
        return res.status(400).send({ message: "Vui lòng chọn sách và ngày hẹn lấy!" });
    }

    try {
        const reader = await Reader.findOne({ madocgia: req.body.madocgia });
        const book = await Book.findOne({ masach: req.body.masach });
        
        if (!reader || !book) return res.status(404).send({ message: "Độc giả hoặc Sách không tồn tại!" });

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

        
        const book = await Book.findOne({ masach: borrowing.masach });
        if (!book || book.soQuyen < 1) {
            return res.status(400).send({ message: "Sách đã hết, không thể duyệt!" });
        }

        book.soQuyen -= 1;
        await book.save();

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
        res.send({ message: "Duyệt thành công! Đã trừ kho.", data: borrowing });

    } catch (err) {
        res.status(500).send({ message: "Lỗi khi duyệt phiếu mượn." });
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

        borrowing.ngayTra = new Date(); 
        borrowing.trangThai = 'Đã trả';

        await borrowing.save();
        res.send({ message: "Trả sách thành công! Đã hoàn lại kho.", data: borrowing });

    } catch (err) {
        res.status(500).send({ message: "Lỗi khi trả sách." });
    }
};

exports.findAll = async (req, res) => {
    try {
        const data = await Borrowing.find();
        res.send(data);
    } catch (err) { res.status(500).send({ message: "Lỗi lấy danh sách." }); }
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