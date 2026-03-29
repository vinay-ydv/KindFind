import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()



const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies

        // console.log("TOKEN:", token) // DEBUG

        if (!token || token === "undefined") {
            return res.status(401).json({ message: "No token provided" })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log("Auth error:", error.message)
        return res.status(401).json({ message: "Invalid token" })
    }
}



export default isAuth