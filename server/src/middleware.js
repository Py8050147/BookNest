import { User } from "./models/userModels/user.models.js"
import jwt from "jsonwebtoken"


export const verifyToken = async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log(token)

    if (!token) {
        return next(new Error(401, 'Unauthorized'))
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        return next(new Error(401, 'Unauthorized'))


    }

}