const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
  //! Hay que cambiar el link de verificacion
  const verificationLink = `http://localhost:5173/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirma tu cuenta en AsesoriaBot',
    html: `
      <h2>¡Bienvenido a AsesoriaBot! 🚀</h2>
      <p>Gracias por registrarte. Para confirmar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background:#AD8B73;color:white;border-radius:5px;text-decoration:none;">
        Confirmar Cuenta
      </a>
      <p>Si no creaste esta cuenta, ignora este correo.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
