const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../middlewares/passport');

const AccountController = require('../controllers/AccountController');

//Routes:
router.post('/signup', (req, res) => AccountController.signUp(req, res));
router.post('/signin', (asd) => console.log(asd), (req, res) => AccountController.signIn(req, res));
router.post('/google', passport.authenticate('googleToken', { session: false }), (req, res) => AccountController.oauthSignIn(req, res));
router.post('/facebook', passport.authenticate('facebookToken', { session: false }), (req, res) => AccountController.oauthSignIn(req, res));
router.post('/send_recovery_password_email', (req, res) => AccountController.sendRecoveryPasswordEmail(req, res));
router.post('/send_email_verification', (req, res) => AccountController.sendEmailVerification(req, res));
router.post('/update_verified_email', (req, res) => AccountController.updateVerifiedEmail(req, res));
router.post('/passwordreset', (req, res) => AccountController.passwordReset(req, res));
router.post('/check_if_token_has_expired', passport.authenticate('jwt', { session: false }), (req, res) => AccountController.checkIfTokenHasExpired(req, res));
router.delete('/delete-account/:userId', passport.authenticate('jwt', { session: false }), (req, res) => AccountController.deleteAccount(req, res));

module.exports = router;
