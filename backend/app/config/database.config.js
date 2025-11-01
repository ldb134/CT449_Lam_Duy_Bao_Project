const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Kết nối CSDL thành công!");
    } catch (error) {
        console.log("Kết nối CSDL thất bại!", error);
        process.exit(1);
    }
}

module.exports = { connect };