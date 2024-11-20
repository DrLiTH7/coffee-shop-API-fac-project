const nodemailer = require('nodemailer');

// Configuração do transporte do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Ou outro serviço, como 'hotmail'
    auth: {
        user: 'tt1460230@gmail.com',  // Seu e-mail
        pass: 'ocfxhgnslpmtjewq'  // Sua senha ou senha de aplicativo
    }
});

const enviarEmail = (destinatario, assunto, mensagem) => {
    const mailOptions = {
        from: 'tt1460230@gmail.com',  // E-mail de origem
        to: destinatario,  // E-mail de destino
        subject: assunto,  // Assunto do e-mail
        text: mensagem // Corpo do e-mail
    };

    transporter.sendMail(mailOptions, (erro, info) => {
        if (erro) {
            console.log('Erro ao enviar e-mail:', erro);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
};

module.exports = { enviarEmail };
