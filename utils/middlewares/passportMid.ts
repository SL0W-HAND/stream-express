import { Strategy, ExtractJwt, StrategyOptions} from "passport-jwt";
import config from "../../config/index";

var cookieExtractor = function(req:any) {
  var token = null;
  //console.log(req.cookies);
  if (req && req.cookies)
  {
      token = req.cookies['token'];
  }
  return token;
};

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.jwtSecret
}


export default new Strategy(opts,  (payload, done) =>{
  return done(null, true)
});