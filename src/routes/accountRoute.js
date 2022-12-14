const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../middlewares/passport');

const AccountController = require('../controllers/AccountController');

//Routes:
router.post('/signup', AccountController.signUp);
router.post('/signin', AccountController.signIn);
router.post('/google', passport.authenticate('googleToken', { session: false }), AccountController.oauthSignIn);
router.post('/facebook', passport.authenticate('facebookToken', { session: false }), AccountController.oauthSignIn);
router.post('/send_recovery_password_email', AccountController.sendRecoveryPasswordEmail);
router.post('/send_email_verification', AccountController.sendEmailVerification);
router.post('/update_verified_email', AccountController.updateVerifiedEmail);
router.post('/passwordreset', AccountController.passwordReset);
router.post('/check_if_token_has_expired', passport.authenticate('jwt', { session: false }), AccountController.checkIfTokenHasExpired);
router.delete('/delete-account/:userId', passport.authenticate('jwt', { session: false }), AccountController.deleteAccount);

module.exports = router;
