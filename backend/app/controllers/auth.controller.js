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

// ĐỔI MẬT KHẨU 
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; 
        const role = req.user.role; 

        let user = null;

        if (role === 'reader') {
            user = await Reader.findById(userId);
        } else if (role === 'staff') {
            user = await Staff.findById(userId);
        }

        if (!user) {
            return res.status(404).send({ message: "Tài khoản không tồn tại!" });
        }

        // Kiểm tra mật khẩu cũ có đúng không
        const isValid = await bcrypt.compare(oldPassword, user.password);
        if (!isValid) {
            return res.status(400).send({ message: "Mật khẩu cũ không chính xác!" });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Lưu mật khẩu mới
        user.password = hashedPassword;
        await user.save();

        res.send({ message: "Đổi mật khẩu thành công!" });

    } catch (err) {
        res.status(500).send({ message: "Lỗi server: " + err.message });
    }
};

exports.loginSocial = async (req, res) => {
    try {
        const { email, displayName } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Không tìm thấy email từ tài khoản mạng xã hội!" });
        }

        let reader = await Reader.findOne({ email: email });
        let isNewUser = false; 

        // Nếu chưa có thì tạo mới (Tự động Đăng ký)
        if (!reader) {
            isNewUser = true; 

            // --- TÁCH TÊN AN TOÀN (Phòng trường hợp displayName bị trống) ---
            let hoLot = '';
            let ten = 'Người Dùng';
            
            if (displayName && displayName.trim().length > 0) {
                const nameParts = displayName.trim().split(' ');
                ten = nameParts.pop(); // Lấy từ cuối cùng làm Tên
                hoLot = nameParts.join(' '); // Phần còn lại là Họ lót
            }
            // ----------------------------------------------------------------

            const nextMaDocGia = await getNextSequenceValue("madocgia");
            const formattedMaDocGia = "DG" + String(nextMaDocGia).padStart(3, '0');

            reader = new Reader({
                madocgia: formattedMaDocGia,
                hoLot: hoLot,
                ten: ten,
                email: email,
                diaChi: "", 
                phai: "Nam", 
                ngaySinh: new Date(),
            });

            await reader.save();
        }

        // ... (Tạo token và trả về response giữ nguyên)
        const token = jwt.sign(
            { id: reader._id, role: 'reader', madocgia: reader.madocgia }, 
            SECRET_KEY, 
            { expiresIn: '1d' }
        );

        res.send({ 
            message: "Đăng nhập mạng xã hội thành công", 
            token: token, 
            isNewUser: isNewUser, 
            user: { 
                _id: reader._id,
                madocgia: reader.madocgia,
                hoTen: `${reader.hoLot} ${reader.ten}`,
                ten: reader.ten,
                role: 'reader',
                email: reader.email
            } 
        });

    } catch (err) {
        // Bắt lỗi Mongoose Validation và trả về 400
        if (err.name === 'ValidationError') {
             // Thường xảy ra khi trường 'ten' bị trống dù đã cố gắng xử lý
             return res.status(400).send({ message: "Lỗi Validation: Vui lòng kiểm tra lại cấu hình tên." });
        } else if (err.code === 11000) { 
             // Lỗi trùng lặp key (ví dụ email đã tồn tại, nhưng bạn đã fix lỗi này rồi)
             return res.status(400).send({ message: "Lỗi trùng lặp thông tin." });
        }
        
        console.log("SERVER ERROR:", err);
        res.status(500).send({ message: "Lỗi server không xác định: " + err.message });
    }
};