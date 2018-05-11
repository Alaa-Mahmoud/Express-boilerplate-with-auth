import User from './user.model';
import JWT from 'jsonwebtoken';
import MYENV from '../../config/app-env';

let signToken = (user) => {
    return JWT.sign({
        iss: 'authapi',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().getTime() + 1,
    }, MYENV.JWT_SECRET);
};


export default {
    signUp: async(req, res, next) => {
        try {
            const { email, password } = req.value.body;
            const foundUser = await User.findOne({ "local.email": email });
            if (foundUser) return res.status(403).json({ error: 'Email already in use' });
            const newUser = new User({
                method: 'local',
                local: {
                    email: email,
                    password: password
                }
            });
            await newUser.save();
            const token = signToken(newUser);
            console.log(token);
            res.status(200).json({ message: 'User created', token });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    signIn: async(req, res, next) => {
        try {
            const token = signToken(req.user);
            res.status(200).json({ message: 'success', token });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    googleOauth: async(req, res, next) => {
        try {
            const token = signToken(req.user);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    facebookOauth: async(req, res, next) => {
        try {
            const token = signToken(req.user);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: error });

        }
    },

    secret: async(req, res, next) => {
        res.send('itworks');
    }
}