const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "bi_mat_khong_the_bat_mi";

exports.verifyToken = (req, res, next) => {
    const tokenHeader = req.headers["authorization"];

    if (!tokenHeader) {
        return res.status(403).send({ message: "Không có token! Vui lòng đăng nhập." });
    }

    const token = tokenHeader.startsWith("Bearer ") ? tokenHeader.slice(7, tokenHeader.length) : tokenHeader;

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
        req.user = decoded; 
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'QuanLy' || req.user.chucVu === 'QuanLy')) {
        next();
    } else {
        res.status(403).send({ message: "Bạn không có quyền Quản lý!" });
    }
};