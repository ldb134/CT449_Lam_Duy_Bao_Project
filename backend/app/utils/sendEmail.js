// [File: app/utils/sendEmail.js]
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        // Cấu hình dịch vụ gửi mail (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "duybaost134@gmail.com", // <-- Thay bằng email của bạn
                pass: "asuy rkvy igar dwhm",      // <-- Thay bằng App Password vừa tạo (không phải pass đăng nhập)
            },
        });

        // Cấu hình nội dung mail
        const mailOptions = {
            from: '"Thư Viện CTU" <no-reply@library.ctu.edu.vn>', // Tên người gửi hiển thị
            to: to,       // Địa chỉ người nhận
            subject: subject, // Tiêu đề
            html: text,   // Nội dung (dạng HTML)
        };

        // Gửi mail
        await transporter.sendMail(mailOptions);
        console.log("📧 Email đã được gửi đến:", to);
    } catch (error) {
        console.error("❌ Lỗi gửi email:", error);
        // Không throw lỗi để tránh làm crash server nếu gửi mail thất bại
    }
};

module.exports = sendEmail;