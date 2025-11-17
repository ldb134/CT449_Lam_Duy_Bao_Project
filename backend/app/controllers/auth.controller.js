const Reader = require('../models/reader.model');
const Staff = require('../models/staff.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getNextSequenceValue = require('../utils/getNextSequence');

const SECRET_KEY = process.env.JWT_SECRET || "bi_mat_khong_the_bat_mi";

exports.registerReader = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const nextMaDocGia = await getNextSequenceValue("madocgia");
        const formattedMaDocGia = "DG" + String(nextMaDocGia).padStart(3, '0');

        const reader = new Reader({
            madocgia: formattedMaDocGia,
            hoLot: req.body.hoLot,
            ten: req.body.ten,
            ngaySinh: req.body.ngaySinh,
            phai: req.body.phai,
            diaChi: req.body.diaChi,
            dienThoai: req.body.dienThoai,
            password: hashedPassword 
        });

        await reader.save();
        res.send({ message: "Đăng ký thành công!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// ĐĂNG NHẬP ĐỘC GIẢ
exports.loginReader = async (req, res) => {
    try {
        const reader = await Reader.findOne({ dienThoai: req.body.dienThoai });
        if (!reader) return res.status(404).send({ message: "Số điện thoại chưa đăng ký!" });

        const validPass = await bcrypt.compare(req.body.password, reader.password);
        if (!validPass) return res.status(400).send({ message: "Sai mật khẩu!" });

        const token = jwt.sign(
            { id: reader._id, role: 'reader', madocgia: reader.madocgia }, 
            SECRET_KEY, 
            { expiresIn: '1d' }
        );

        res.send({ 
            message: "Đăng nhập thành công", 
            token: token, 
            user: { 
                _id: reader._id,
                madocgia: reader.madocgia,
                hoTen: reader.hoTen, 
                ten: reader.ten,
                role: 'reader' 
            } 
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// ĐĂNG NHẬP NHÂN VIÊN
exports.loginStaff = async (req, res) => {
    try {
        const staff = await Staff.findOne({ msnv: req.body.msnv });
        if (!staff) return res.status(404).send({ message: "MSNV không tồn tại!" });

        const validPass = await bcrypt.compare(req.body.password, staff.password);
        if (!validPass) return res.status(400).send({ message: "Sai mật khẩu!" });

        const token = jwt.sign(
            { id: staff._id, role: 'staff', chucVu: staff.chucVu, msnv: staff.msnv }, 
            SECRET_KEY, 
            { expiresIn: '1d' }
        );

        res.send({ 
            message: "Đăng nhập thành công", 
            token: token, 
            user: { 
                _id: staff._id,
                msnv: staff.msnv,
                hoTenNV: staff.hoTenNV,
                role: staff.chucVu 
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};