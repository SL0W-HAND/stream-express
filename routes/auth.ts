import { Router } from "express";
import{ signIn } from "../controllers/userControllers"

const router = Router()

router.post('/signin',signIn)

export default router