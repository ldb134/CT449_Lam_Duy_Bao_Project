const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./app/config/database.config');

dotenv.config();

db.connect();

const app = express();
const path = require("path");

const startCronJobs = require('./app/utils/cronJob');
startCronJobs(); 

app.use(cors()); 
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.json({ message: "Chào mừng đến với API Quản lý mượn sách." });
});

require('./app/routes/staff.route')(app);

require('./app/routes/reader.route')(app);

require('./app/routes/publisher.route')(app);

require('./app/routes/book.route')(app);

require('./app/routes/borrowing.route')(app);

require('./app/routes/auth.route')(app);

require('./app/routes/notification.route')(app);

require("./app/routes/transaction.route")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}.`);
});