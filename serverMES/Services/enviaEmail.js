const nodemailer = require('nodemailer');

const Functions = require('../Services/functions')

try {


    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'alerta@magius.com.br',
            pass: 'Magius1@'
        }
    });

    var enviaEmail = function (assunto, mensagem, responsavel, email) {

         Functions.escreverLog("Enviando e-mail para: " + responsavel + " - assunto: " + assunto + " - mensagem: " + mensagem)

        const mailOptions = {
            from: '"Alerta" <alerta@magius.com.br>', // sender address
            to: email,
            subject: assunto,
            text: responsavel + ',\n\n' + mensagem
        };

        try {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    Functions.escreverLog(`Falha ao enviar e-mail (sendMail) - Erro: ${error}`)
                } else {
                    Functions.escreverLog('Email enviado: ' + info.response)
                }
            });
        } catch (err) {
            Functions.escreverLog(`Falha ao enviar e-mail - Erro: ${err}`)
        }


    }

} catch (err) {

    Functions.escreverLog(`Falha ao iniciar função para enviar e-mail - Erro: ${err}`)
}

module.exports = enviaEmail;
