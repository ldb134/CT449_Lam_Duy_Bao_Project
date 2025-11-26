const Notification = require('../models/notification.model');

exports.getMine = async (req, res) => {
    try {
        const data = await Notification.find({ madocgia: req.user.madocgia })
            .sort({ createdAt: -1 })
            .limit(20); 
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: "Lỗi lấy thông báo." });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { daXem: true });
        res.send({ message: "Đã xem." });
    } catch (err) {
        res.status(500).send({ message: "Lỗi cập nhật." });
    }
};