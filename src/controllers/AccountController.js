const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const generateToken = require('../modules/generateToken');
const mailer = require('../modules/mailer');
const User = require('../models/User');
const UserImage = require('../models/UserImage');
const { validatePassword, validateEmail } = require('../helpers/validator');
const messages = require('../helpers/messages');
const UserController = require('./UserController');

module.exports = {

    async signUp(req, res) {
        const { email } = req.body;

        try {

            const user = await User.findOne({ where: { email } });

            if (!user) {

                if (!validateEmail(email))
                    return res.status(400).send(messages.invalidEmail);

                if (!validatePassword(req.body.password))
                    return res.status(400).send(messages.invalidPassword);

                const password = await bcrypt.hash(req.body.password, 10);

                const user = req.body;
                user.password = password;

                await User.create(user).then(createdUser => {
                    createdUser.password = undefined;

                    return res.status(200).send({ token: generateToken({ id: createdUser.id }) });
                });
            }
            else
                return res.status(400).send(messages.emailAlreadyUsed);

        } catch (err) {
            
            console.log(err)
            return res.status(400).send(err);
        }
    },

    async oauthSignIn(req, res) {
        return res.status(200).send({ token: generateToken({ id: req.user.id }) });
    },

    async signIn(req, res) {

        const { email, password } = req.body;

        try {

            const user = await User.findOne({ where: { email } });

            if (!user)
                return res.status(400).send(messages.invalidEmailOrPassword);

            if (!await bcrypt.compare(password, user.password))
                return res.status(400).send(messages.invalidEmailOrPassword);

            user.password = undefined;

            return res.status(200).send({ token: generateToken({ id: user.id }) });
        } catch (err) {

            return res.status(400).send(err);
        }
    },

    async deleteAccount(req, res) {
        const { userId } = req.params;

        try {
            await User.destroy({ where: { id: userId } });

            await UserImage.findAll({ where: { userId } }).then((images) => {

                images.map((image) => {
                    const id = image.dataValues.id;
                    const teste = UserController.deleteUserImage({ params: { id } }, null);
                });
            });

            return res.status(200).send('Account successfully deleted!');
        } catch (err) {

            return res.status(400).send(err);
        }
    },

    async sendRecoveryPasswordEmail(req, res) {
        
        const { email } = req.body;

        try {
            const user = await User.findOne({ where: { email } });

            if (!user)
                return res.status(404).send(messages.emailNotFound);

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();

            now.setHours(now.getHours() + 1);

            user.passwordResetToken = token;
            user.passwordResetExpires = now;

            await user.save();

            const { FRONTEND_URL } = process.env;

            mailer.sendMail({
                to: email,
                from: '💕App Namoro <naoresponder@appnamoro.com>',
                template: 'auth/forgotPassword',
                subject: 'Recuperação de senha',
                context: { token, email, FRONTEND_URL }
            }, (err) => {

                if (err)
                    return res.status(400).send(messages.unableToSendEmail);

                return res.status(200).send();
            });
        }
        catch (error) {

            return res.status(400).send(messages.unableToSendEmail);
        }
    },

    async sendEmailVerification(req, res) {

        const { email, id } = req.body;

        try {
            const user = await User.findOne({ where: { id } });

            if (!user)
                return res.status(404).send(messages.userNotFound);

            const token = crypto.randomBytes(20).toString('hex');

            user.emailVerificationToken = token;

            await user.save();

            const { FRONTEND_URL } = process.env;

            mailer.sendMail({
                to: email,
                from: '💕App Namoro <naoresponder@appnamoro.com>',
                template: 'auth/verificationEmail',
                subject: 'Verificação de e-mail',
                context: { token, email, id, FRONTEND_URL }
            }, (err) => {

                if (err)
                    return res.status(400).send(messages.unableToSendEmail);

                return res.status(200).send();
            });
        }
        catch (error) {
            return res.status(400).send(messages.unableToSendEmail);
        }
    },

    async updateVerifiedEmail(req, res) {

        const { email, token, id } = req.body;

        try {

            const user = await User.findOne({ where: { id } });

            if (!user)
                return res.status(404).send(messages.userNotFound);

            if (token !== user.emailVerificationToken)
                return res.status(400).send(messages.invalidToken);

            user.email = email;
            user.verifiedEmail = 1;
            user.emailVerificationToken = null;

            await user.save();

            return res.status(200).send('Email atualizado com sucesso!');
        }
        catch (error) {
            res.status(400).send('Cannot verify this email, try again\nRef: ' + error);
        }
    },

    async checkIfTokenHasExpired(req, res) {
        return res.status(200).send();
    },

    async passwordReset(req, res) {
        const { email, token, password, passwordConfirmation } = req.body;

        try {
            if (password == '' || password == null)
                return res.status(400).send(messages.passwordCannotBeEmpty);

            if (password !== passwordConfirmation)
                return res.status(400).send(messages.passwordsMustBeTheSame);

            if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/u.test(password))
                return res.status(400).send(messages.invalidPassword);

            const user = await User.findOne({ where: { email } });

            if (!user)
                return res.status(400).send(messages.emailNotFound);

            if (token !== user.passwordResetToken)
                return res.status(400).send(messages.invalidToken);

            const now = new Date();

            if (now > user.passwordResetExpires)
                return res.status(400).send(messages.tokenExpired);

            const newPassword = await bcrypt.hash(password, 10);

            user.password = newPassword;
            user.passwordResetExpires = null;
            user.passwordResetToken = null;

            await user.save();

            return res.status(200).send('Senha atualizada com sucesso!');
        }
        catch (error) {
            res.status(400).send('Cannot reset password, try again\nRef: ' + error);
        }
    }
}
