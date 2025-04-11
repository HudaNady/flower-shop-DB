import nodemailer from 'nodemailer';

const sendEmail = async ({ from = '"Flower Shop app" <email>', to, subject = "Password Reset Verification Code", html } = {}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: "hudanady9@gmail.com",
            pass: "gfbmtuabrrohbfcd" 
        }
    });

    try {
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html
        });
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

export default sendEmail;