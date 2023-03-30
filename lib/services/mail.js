'use strict';

require('dotenv').config();
const { Service } = require('@hapipal/schmervice');
const { transporter } = require('../../server/mailer');

module.exports = class MailService extends Service {
    sendMail(user) {

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: user.mail,
            subject: 'Bienvenue parmis nous !',
            text: 'Merci ' + user.userName + ' d\'avoir choisi notre site !'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
            }
        })

    }

    async sendMailNewMovie(movie, userService) {

        const users = await userService.getAll();

        users.forEach(user => {
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: user.mail,
                subject: 'Un nouveau film est disponible',
                text: 'Le film ' + movie.title + ' viens d\'être ajouté',
            }

            transporter.sendMail(mailOptions, (error, info) => {
                error ? console.log(error) : console.log('Email sent' + info.response);
            });
        });
    }

}