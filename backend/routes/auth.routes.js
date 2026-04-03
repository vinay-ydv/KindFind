import express from "express"

import { logIn, logOut, signUp } from "../controllers/auth.controllers.js"
import isAuth from "../middleware/isAuth.js"

let authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/login",logIn)
authRouter.get("/logout",isAuth,logOut)

export default authRouter