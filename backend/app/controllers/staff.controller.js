const Staff = require('../models/staff.model');

// Tạo mới một nhân viên
exports.create = async (req, res) => {
    if (!req.body.msnv || !req.body.hoTenNV || !req.body.password) {
        return res.status(400).send({ message: "MSNV, Họ tên và Password không được để trống!" });
    }

    const staff = new Staff({
        msnv: req.body.msnv,
        hoTenNV: req.body.hoTenNV,
        password: req.body.password, 
        chucVu: req.body.chucVu,
        diaChi: req.body.diaChi,
        soDienThoai: req.body.soDienThoai
    });

    try {
        const data = await staff.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi tạo nhân viên."
        });
    }
};

// Lấy tất cả nhân viên
exports.findAll = async (req, res) => {
    try {
        const data = await Staff.find();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi lấy danh sách nhân viên."
        });
    }
};

