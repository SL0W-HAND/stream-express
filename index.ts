import express  from "express";
import passport from "passport";
import cors from "cors"
import config from "./config/index"
import passportMiddleware from "./utils/middlewares/passportMid";
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

//import routes
import authRoute from './routes/auth'
import videoRoute from './routes/videos'

const app = express()

//settings
app.set('port', config.port)

//middlewares
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser())
app.use(passport.initialize());
passport.use(passportMiddleware);

app.get('/', (req, res) => {
    return res.send(`The API is at http://localhost:${app.get('port')}`);
})

//Routes
app.use(authRoute)
app.use(videoRoute)

app.listen(config.port,()=>{
    console.log(`server runing on port ${config.port}`)
})