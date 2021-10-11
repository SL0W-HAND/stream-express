import express from 'express';
import passport from 'passport';
import cors from 'cors';
import config from './config/index';
import passportMiddleware from './utils/middlewares/passportMid';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//----------------experimental things---------------------
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const secret: any = config.jwtSecret;

function createToken() {
	//console.log(secret)
	return jwt.sign({ auth: true }, secret, { expiresIn: '600s' });
}

//
//import routes
import videoRoute from './routes/videos';

const app = express();

//settings
app.set('port', config.port);
//app.options('/signin',cors)

//middlewares
app.use(
	cors({
		origin: true,
		methods: ['GET', 'POST'],
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
passport.use(passportMiddleware);

app.get('/', (req, res) => {
	return res.send(`The API is at http://localhost:${app.get('port')}`);
});

//Routes
app.use(videoRoute);
app.post('/example', (req, res) => {
	res.cookie('lol', 'example').json({
		message: 'example',
	});
});
app.post('/login', (req: Request, res: Response, next) => {
	if (!req.body.password) {
		res.cookie('token', { maxAge: 0 })
			.status(400)
			.json({ msg: 'Please. Send your password' });
	}

	const isMatch = () => {
		if (req.body.password === config.user.password) {
			return true;
		} else {
			return false;
		}
	};
	if (isMatch()) {
		let token = createToken();
		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
			maxAge: 1000 * 60 * 15,
		}).json({
			auth: true,
		});
	} else {
		res.cookie('token', { maxAge: 0 }).status(400).json({
			msg: 'The password are incorrect',
			auth: false,
		});
	}
	next();
});

app.get(
	'/refresh_token',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		let token = createToken();
		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
		})
			.json({
				auth: true,
			})
			.status(200);
		next();
	}
);

//export default app
module.exports = app;
