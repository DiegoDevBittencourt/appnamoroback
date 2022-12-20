const express = require('express');
const router = express.Router();
const passport = require('passport')
const multer = require('multer');
const multerConfig = require('../config/multer');

require('../middlewares/passport');

const UserController = require('../controllers/UserController');

//Routes:
router.get('/get_user/:id', passport.authenticate('jwt', { session: false }), UserController.getUser);
router.get('/get_matched_profiles/:userId', passport.authenticate('jwt', { session: false }), UserController.getMatchedProfiles);
router.post('/get_profile_to_the_match_searcher', passport.authenticate('jwt', { session: false }), UserController.getProfileToTheMatchSearcher);
router.post('/update_user', passport.authenticate('jwt', { session: false }), UserController.updateUser);
router.post('/contact', /*passport.authenticate('jwt', { session: false }),*/ UserController.newUserContact);
router.post('/create_or_update_user_match', passport.authenticate('jwt', { session: false }), UserController.createOrUpdateUserMatch);
router.post('/unmatch', passport.authenticate('jwt', { session: false }), UserController.unmatch);
router.post('/user_images/:userId', passport.authenticate('jwt', { session: false }), multer(multerConfig).single('file'), UserController.insertUserImage);
router.delete('/user_images/:id', passport.authenticate('jwt', { session: false }), UserController.deleteUserImage);

module.exports = router;
