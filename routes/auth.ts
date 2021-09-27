import { Router } from 'express';
import { signIn, refreshToken } from '../controllers/userControllers';
import passport from 'passport';

const router = Router();

router.post('/signin', signIn);
router.get(
	'/refresh_token',
	passport.authenticate('jwt', { session: false }),
	refreshToken
);

export default router;
