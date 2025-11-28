const Book = require('../models/book.model');
const Publisher = require('../models/publisher.model');
const Borrowing = require('../models/borrowing.model');
const getNextSequenceValue = require('../utils/getNextSequence');

const fs = require('fs');
const path = require('path');

exports.create = async (req, res) => {
    if (!req.body.tenSach || !req.body.donGia || !req.body.soQuyen || !req.body.manxb) {
        return res.status(400).send({ message: "Tên sách, đơn giá, số quyển và mã NXB không được để trống!" });
    }

    try {
        const publisher = await Publisher.findOne({ manxb: req.body.manxb });
        if (!publisher) {
            return res.status(404).send({ message: "Mã Nhà Xuất Bản không tồn tại!" });
        }

        const nextMaSach = await getNextSequenceValue("masach");
        const formattedMaSach = "S" + String(nextMaSach).padStart(3, '0'); 

        // Xử lý ảnh upload
        let imagePath = "";
        if (req.file) {
            imagePath = "/uploads/" + req.file.filename;
        } else if (req.body.anh) {
            imagePath = req.body.anh; 
        }

        const book = new Book({
            masach: formattedMaSach,
            tenSach: req.body.tenSach,
            donGia: req.body.donGia,
            soQuyen: req.body.soQuyen,
            namXuatBan: req.body.namXuatBan,
            manxb: req.body.manxb,
            tacGia: req.body.tacGia,
            anh: imagePath
        });

        const data = await book.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi tạo Sách."
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.q) {
            query.$or = [
                { tenSach: { $regex: req.query.q, $options: 'i' } },
                { tacGia: { $regex: req.query.q, $options: 'i' } },
                { masach: { $regex: req.query.q, $options: 'i' } }
            ];
        }
        
        if (req.query.nxb) query.manxb = req.query.nxb;
        if (req.query.year) query.namXuatBan = req.query.year;

        const [books, total] = await Promise.all([
            Book.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Book.countDocuments(query)
        ]);

        res.send({
            books, 
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi lấy danh sách Sách."
        });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id; 
    try {
        const data = await Book.findOne({ masach: id });
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy sách mã " + id });
        }
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi tìm sách mã " + id });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const updateData = { ...req.body };

    try {
        const oldBook = await Book.findOne({ masach: id });
        
        if (!oldBook) {
            return res.status(404).send({ message: "Không tìm thấy sách!" });
        }

        if (req.file) {
            updateData.anh = "/uploads/" + req.file.filename;

            if (oldBook.anh && !oldBook.anh.startsWith('http')) {
                const oldPath = path.join(__dirname, '../../app', oldBook.anh);
                
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log("Đã xóa ảnh cũ:", oldPath);
                }
            }
        } else {
            delete updateData.anh; 
        }

        const data = await Book.findOneAndUpdate({ masach: id }, updateData, { useFindAndModify: false, new: true });
        res.send({ message: "Cập nhật thành công", data });
    } catch (err) {
        res.status(500).send({ message: "Lỗi cập nhật: " + err.message });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Book.findOneAndDelete({ masach: id });
        
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy sách để xóa mã " + id });
        }

        if (data.anh && !data.anh.startsWith('http')) {
            const imagePath = path.join(__dirname, '../../app', data.anh);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log("Đã dọn dẹp ảnh của sách đã xóa:", imagePath);
            }
        }

        res.send({ message: "Xóa sách thành công!" });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi xóa sách mã " + id });
    }
};

// API Thống kê
exports.findTopBorrowed = async (req, res) => {
    try {
        const result = await Borrowing.aggregate([
            { $group: { _id: "$masach", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
            {
                $lookup: {
                    from: "Sach",
                    localField: "_id",
                    foreignField: "masach",
                    as: "bookInfo"
                }
            },
            { $unwind: "$bookInfo" },
            { $replaceRoot: { newRoot: "$bookInfo" } }
        ]);
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: "Lỗi lấy top sách." });
    }
};

exports.findNew = async (req, res) => {
    try {
        const data = await Book.find().sort({ createdAt: -1 }).limit(8);
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Lỗi lấy sách mới." });
    }
};

exports.getAllYears = async (req, res) => {
    try {
        const result = await Book.aggregate([
            { 
                $group: { 
                    _id: "$namXuatBan", 
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { _id: -1 } }
        ]);
        
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: "Lỗi lấy danh sách năm xuất bản." });
    }
};