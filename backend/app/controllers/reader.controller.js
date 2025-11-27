const Reader = require('../models/reader.model');
const getNextSequenceValue = require('../utils/getNextSequence');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
    // Validate 
    if (!req.body.hoLot || !req.body.ten || !req.body.dienThoai || !req.body.ngaySinh || !req.body.phai || !req.body.diaChi) {
        return res.status(400).send({ 
            message: "Vui lòng nhập đầy đủ thông tin" 
        });
    }

    try {
        // Lấy mã tự tăng
        const nextMaDocGia = await getNextSequenceValue("madocgia");
        // Format mã: DG001, DG002...
        const formattedMaDocGia = "DG" + String(nextMaDocGia).padStart(3, '0');

        const reader = new Reader({
            madocgia: formattedMaDocGia, 
            hoLot: req.body.hoLot,
            ten: req.body.ten,
            ngaySinh: req.body.ngaySinh,
            phai: req.body.phai,
            diaChi: req.body.diaChi,
            dienThoai: req.body.dienThoai
        });

        const data = await reader.save();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi tạo độc giả."
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        if (!req.query.page) {
            const data = await Reader.find();
            return res.send(data);
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        let query = {};
        if (req.query.q) {
            query.$or = [
                { ten: { $regex: req.query.q, $options: 'i' } },
                { hoLot: { $regex: req.query.q, $options: 'i' } },
                { dienThoai: { $regex: req.query.q, $options: 'i' } },
                { madocgia: { $regex: req.query.q, $options: 'i' } }
            ];
        }

        const [readers, total] = await Promise.all([
            Reader.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Reader.countDocuments(query)
        ]);

        res.send({
            readers,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (err) {
        res.status(500).send({ message: "Lỗi lấy danh sách độc giả." });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id; 
    
    try {
        const data = await Reader.findOne({ madocgia: id }); 

        if (!data) {
            return res.status(404).send({ message: "Không tìm thấy độc giả với mã=" + id });
        }
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi tìm độc giả với mã=" + id });
    }
};

// Cập nhật độc giả
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Dữ liệu cập nhật không được để trống!" });
    }

    const id = req.params.id;
    
    const updateData = { ...req.body };

    try {
        // Kiểm tra xem có gửi password và password có nội dung không
        if (updateData.password && updateData.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        } else {
            delete updateData.password;
        }

        // Thay req.body bằng updateData
        const data = await Reader.findOneAndUpdate({ madocgia: id }, updateData, { useFindAndModify: false, new: true });
        
        if (!data) {
            return res.status(404).send({ message: `Không thể cập nhật độc giả với mã=${id}.` });
        }
        res.send({ message: "Cập nhật độc giả thành công.", data: data });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi cập nhật độc giả với mã=" + id });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id; 

    try {
        const data = await Reader.findOneAndDelete({ madocgia: id }); 

        if (!data) {
            return res.status(404).send({ message: `Không tìm thấy độc giả với mã=${id}.` });
        }
        res.send({ message: "Xóa độc giả thành công!" });
    } catch (err) {
        res.status(500).send({ message: "Lỗi khi xóa độc giả với mã=" + id });
    }
};