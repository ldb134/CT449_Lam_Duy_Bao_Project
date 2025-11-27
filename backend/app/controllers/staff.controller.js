const Staff = require('../models/staff.model');
const getNextSequenceValue = require('../utils/getNextSequence');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
    if (!req.body.hoTenNV || !req.body.password) {
        return res.status(400).send({ message: "Họ tên và Password không được để trống!" });
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const nextMSNV = await getNextSequenceValue("msnv");
        const formattedMSNV = "NV" + String(nextMSNV).padStart(3, '0');

        const staff = new Staff({
            msnv: formattedMSNV,
            hoTenNV: req.body.hoTenNV,
            password: hashedPassword, 
            chucVu: req.body.chucVu,
            diaChi: req.body.diaChi,
            soDienThoai: req.body.soDienThoai
        });
        
        const data = await staff.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi tạo nhân viên."
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        if (!req.query.page) {
            const data = await Staff.find();
            return res.send(data);
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [staffs, total] = await Promise.all([
            Staff.find().skip(skip).limit(limit),
            Staff.countDocuments()
        ]);

        res.send({
            staffs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (err) {
        res.status(500).send({ message: "Lỗi lấy danh sách nhân viên." });
    }
};


exports.findOne = async (req, res) => {
    const id = req.params.id; 

    try {
        const data = await Staff.findOne({ msnv: id }); 

        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy nhân viên với mã=" + id });
        }
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi tìm nhân viên với mã=" + id });
    }
};

exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Dữ liệu cập nhật không được để trống!" });
    }

    const id = req.params.id;

    try {
        const data = await Staff.findOneAndUpdate({ msnv: id }, req.body, { useFindAndModify: false, new: true });
        
        if (!data) {
            return res.status(404).send({ message: `Không thể cập nhật nhân viên với mã=${id}.` });
        }
        res.send({ message: "Cập nhật nhân viên thành công.", data: data });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi cập nhật nhân viên với mã=" + id });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id; 

    try {
        const data = await Staff.findOneAndDelete({ msnv: id }); 

        if (!data) {
            return res.status(404).send({ message: `Không tìm thấy nhân viên với mã=${id}.` });
        }
        res.send({ message: "Xóa nhân viên thành công!" });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi xóa nhân viên với mã=" + id });
    }
};