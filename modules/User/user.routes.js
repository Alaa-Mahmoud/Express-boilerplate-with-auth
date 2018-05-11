import express from 'express';
import validateSchema from '../../services/validationSchema';
import UserController from './user.controller';
import passport from 'passport';
import authService from '../../services/AuthService';

const router = express.Router();
const { schemas, validateBody } = validateSchema;
const passportAuthStrategy = (strategy) => passport.authenticate(strategy, { session: false });


router.post('/signup', validateBody(schemas.authSchema), UserController.signUp);

router.post('/signin', validateBody(schemas.authSchema),
    passportAuthStrategy('local'), UserController.signIn);

router.post('/oauth/google', passportAuthStrategy('googleToken'), UserController.googleOauth);

router.post('/oauth/facebook', passportAuthStrategy('facebookToken'), UserController.facebookOauth);

router.get('/secret', passportAuthStrategy('jwt'), UserController.secret);


export default router;