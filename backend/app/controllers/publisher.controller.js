const Publisher = require('../models/publisher.model');
const getNextSequenceValue = require('../utils/getNextSequence');

exports.create = async (req, res) => {
    if (!req.body.tenNXB || !req.body.diaChi) {
        return res.status(400).send({ message: "Tên NXB và Địa chỉ không được để trống!" });
    }

    try {
        const nextMaNXB = await getNextSequenceValue("manxb");
        const formattedMaNXB = "NXB" + String(nextMaNXB).padStart(3, '0'); 

        const publisher = new Publisher({
            manxb: formattedMaNXB,
            tenNXB: req.body.tenNXB,
            diaChi: req.body.diaChi,
            email: req.body.email,
            dienThoai: req.body.dienThoai
        });

        const data = await publisher.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi tạo Nhà xuất bản."
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        if (!req.query.page) {
            const data = await Publisher.find();
            return res.send(data);
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [publishers, total] = await Promise.all([
            Publisher.find().skip(skip).limit(limit),
            Publisher.countDocuments()
        ]);

        res.send({
            publishers,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi lấy danh sách NXB."
        });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id; 
    try {
        const data = await Publisher.findOne({ manxb: id });
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy NXB có mã " + id });
        }
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi tìm NXB mã " + id });
    }
};

exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Dữ liệu cập nhật không được để trống!" });
    }
    const id = req.params.id;

    try {
        const data = await Publisher.findOneAndUpdate({ manxb: id }, req.body, { useFindAndModify: false, new: true });
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy NXB để cập nhật mã " + id });
        }
        res.send({ message: "Cập nhật NXB thành công.", data: data });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi cập nhật NXB mã " + id });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Publisher.findOneAndDelete({ manxb: id });
        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy NXB để xóa mã " + id });
        }
        res.send({ message: "Xóa NXB thành công!" });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi xóa NXB mã " + id });
    }
};