const Reader = require('../models/reader.model');
const getNextSequenceValue = require('../utils/getNextSequence');

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
        const data = await Reader.find();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Có lỗi xảy ra khi lấy danh sách độc giả."
        });
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

exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Dữ liệu cập nhật không được để trống!" });
    }

    const id = req.params.id; 

    try {
        const data = await Reader.findOneAndUpdate({ madocgia: id }, req.body, { useFindAndModify: false, new: true });
        
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