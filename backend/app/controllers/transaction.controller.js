const Transaction = require('../models/transaction.model');

exports.findAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            Transaction.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Transaction.countDocuments()
        ]);

        res.send({
            logs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });

    } catch (err) {
        res.status(500).send({ message: "Lỗi lấy lịch sử: " + err.message });
    }
};