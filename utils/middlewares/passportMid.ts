import { Strategy, ExtractJwt, StrategyOptions} from "passport-jwt";
import config from "../../config/index";

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}


export default new Strategy(opts,  (payload, done) =>{
  try {
      const user = payload.name
      if (user === config.user.name) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      console.log(error);
    }
});