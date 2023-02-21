const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../models/User');

const maxDistance = 80;
const ageRange = '22,35';

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    // This module is used to verify the token, then, if token is valid, search by the user, if find, it will move on to the controller
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.JWT_SECRET

}, async (jwtToken, done) => {

    //this is used only for token authentication
    const { id } = jwtToken.payload;

    try {
        const user = await User.findOne({ attributes: ['id'], where: { id } });

        if (!user)
            return done(null, false);

        // Otherwise, return the user
        return done(null, user);
    }
    catch (error) {
        done(error, false);
    }
}))

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GoogleTokenStrategy({

    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret

}, async (accessToken, refreshToken, profile, done) => {

    try {
        // Find the user specified in token
        const user = await User.findOne({ where: { email: profile.emails[0].value } })
        if (user)
            return done(null, user)

        // Otherwise, creates one and return it
        const newUser = {
            oauthUId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            method: 'google',
            maxDistance: maxDistance,
            ageRange: ageRange,
            showMeOnApp: 0,
            verifiedEmail: 1,
            emailNotification: 1,
            pushNotification: 1,
        }

        await User.create(newUser).then(createdUser => { return done(null, createdUser) });
    }
    catch (error) {
        done(error, false, error.message);
    }
}));

// FACEBOOK OAUTH STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({

    clientID: process.env.facebookClientID,
    clientSecret: process.env.facebookClientSecret

}, async (accessToken, refreshToken, profile, done) => {

    try {
        // Find the user specified in token
        const user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user)
            return done(null, user);

        // Otherwise, creates one and return it
        const newUser = {
            oauthUId: profile?.id,
            email: profile?.emails[0]?.value,
            firstName: profile?.name?.givenName,
            lastName: profile?.name?.familyName,
            method: 'facebook',
            maxDistance: maxDistance,
            ageRange: ageRange,
            showMeOnApp: 0,
            verifiedEmail: 1,
            emailNotification: 1,
            pushNotification: 1,
        }

        await User.create(newUser).then(createdUser => { return done(null, createdUser) });
    }
    catch (error) {
        done(error, false, error.message);
    }
}));
