const Transaction = require('../models/transaction.model');

exports.findAll = async (req, res) => {
    try {
        const logs = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(100);
            
        res.send(logs);
    } catch (err) {
        res.status(500).send({ message: "Lỗi lấy lịch sử: " + err.message });
    }
};