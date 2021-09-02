import { Request,Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index";

const secret:any = config.jwtSecret

function createToken() {
    //console.log(secret)
    return jwt.sign({ auth: true},secret, { expiresIn: '60s' });
}

export const signIn = async (req: Request, res: Response): Promise<Response> => {

  if (!req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your password" });
  }

  const isMatch = () => {
    if (req.body.password === config.user.password) {
      return true
    } else {
      return false
    }
  }

  if (isMatch()) {
    let token = createToken()
    return res.status(200).cookie('token',token,{
      httpOnly: !config.dev,
      secure: !config.dev,
    }).json({ 
      auth:true
    })
  }

  return res.status(400).json({
    msg: "The password are incorrect",
    auth: false
  });
};