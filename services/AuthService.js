import passport from 'passport';
import passportJWT, { ExtractJwt } from 'passport-jwt';
import passportLocal from 'passport-local';
import GooglePlusTokenStrategy from 'passport-google-plus-token';
import FacebookTokenStrategy from 'passport-facebook-token';
import MYENV from '../config/app-env';
import User from '../modules/User/user.model';

const JwtStrategy = passportJWT.Strategy;
const LocalStrategy = passportLocal.Strategy;

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: MYENV.JWT_SECRET
}, async(payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) return done(null, false);

        done(null, user);
    } catch (error) {
        done(error, false, error.message);
    }
}));

passport.use(new LocalStrategy({
    usernameField: 'email',

}, async(email, password, done) => {
    try {
        const user = await User.findOne({ "local.email": email });

        if (!user) return done(null, false);

        const isMatch = await user.isValidPassword(password);
        console.log('match', isMatch);
        if (!isMatch) return done(null, false);

        return done(null, user);


    } catch (error) {
        done(error, false, error.message);
    }
}));

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: MYENV.OAUTH.google.clientID,
    clientSecret: MYENV.OAUTH.google.clientSecret
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ 'google.id': profile.id });
        if (existingUser) return done(null, existingUser);

        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();

        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }
}));


passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: MYENV.OAUTH.facebook.clientID,
    clientSecret: MYENV.OAUTH.facebook.clientSecret
}, async(accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) return done(null, existingUser);
        const newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }
}));