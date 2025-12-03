const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        // Cấu hình dịch vụ gửi mail (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS,      
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