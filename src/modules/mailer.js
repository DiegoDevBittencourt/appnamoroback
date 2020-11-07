const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars')

const { hostsmtp: host, portsmtp: port, usersmtp: user, passsmtp: pass } = process.env;

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

transport.use('compile', hbs({
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./src/resources/mail/'),
        layoutsDir: path.resolve('./src/resources/mail/'),
        defaultLayout: null,
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.hbs',
}))

module.exports = transport;
