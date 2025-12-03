const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        // Cấu hình dịch vụ gửi mail (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "duybaost134@gmail.com", 
                pass: "asuy rkvy igar dwhm",      
            },
        });

        // Cấu hình nội dung mail
        const mailOptions = {
            from: '"Thư Viện CTU" <no-reply@library.ctu.edu.vn>', 
            to: to,       
            subject: subject, 
            html: text,   
        };

        // Gửi mail
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Lỗi gửi email:", error);
    }
};

module.exports = sendEmail;