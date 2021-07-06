import { Request,Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index";

const secret:any = config.jwtSecret

function createToken(user:any) {
    //console.log(secret)
    return jwt.sign({ name: user.name},secret);
}

export const signIn = async (req: Request, res: Response): Promise<Response> => {
 // console.log(req.body)
  
  if (!req.body.name || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your email and password" });
  }

  const user = ():boolean => {
     if (req.body.name === config.user.name) {
       return true
     } else {
       return false
     }
  }

  if (!user()) {
    return res.status(400).json({ msg: "The User does not exists" });
  }

  const isMatch = () => {
    if (req.body.password === config.user.password) {
      return true
    } else {
      return false
    }
  }
  if (isMatch()) {
    let token = createToken(config.user)
    return res.status(200).json({ 
      user:{
        name:req.body.name,
        auth:true
      },
      token:token 
    });
  }

  return res.status(400).json({
    msg: "The email or password are incorrect"
  });
};