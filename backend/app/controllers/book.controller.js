const Book = require('../models/book.model');
const Publisher = require('../models/publisher.model')
const getNextSequenceValue = require('../utils/getNextSequence');

exports.create = async (req, res) => {
    // Kiểm tra các trường bắt buộc
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

        const book = new Book({
            masach: formattedMaSach,
            tenSach: req.body.tenSach,
            donGia: req.body.donGia,
            soQuyen: req.body.soQuyen,
            namXuatBan: req.body.namXuatBan,
            manxb: req.body.manxb,
            tacGia: req.body.tacGia
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
        const data = await Book.find();
        res.send(data);
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
    if (!req.body) {
        return res.status(400).send({ message: "Dữ liệu cập nhật không được để trống!" });
    }
    const id = req.params.id;

    try {
        const data = await Book.findOneAndUpdate({ masach: id }, req.body, { useFindAndModify: false, new: true });
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy sách để cập nhật mã " + id });
        }
        res.send({ message: "Cập nhật sách thành công.", data: data });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi cập nhật sách mã " + id });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Book.findOneAndDelete({ masach: id });
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy sách để xóa mã " + id });
        }
        res.send({ message: "Xóa sách thành công!" });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi xóa sách mã " + id });
    }
};