import express from 'express';
import passport from 'passport';
import cors from 'cors';
import config from './config/index';
import passportMiddleware from './utils/middlewares/passportMid';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

//import routes
import authRoute from './routes/auth';
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
app.use(authRoute);
app.use(videoRoute);

//export default app
module.exports = app;
