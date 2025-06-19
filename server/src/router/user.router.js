import { Router } from "express"
import { verifyToken } from "../middleware.js"
import { registersUser, loggedInUser, logoutUser, generateNewRefreshToken, getCurrentUser, changeCurrentUser, updateAccountDetails } from "../controller/user.controller.js"

const router = Router()

router.route("/register").post(registersUser)
router.route("/login").post(loggedInUser)
router.route("/logout").post(verifyToken, logoutUser)
router.route("/refresh-token").post(generateNewRefreshToken)
router.route("/getCurrentUser").get(verifyToken, getCurrentUser)
router.route("/change-password").post(verifyToken, changeCurrentUser)
router.route("/updateAccount").patch(verifyToken, updateAccountDetails)

export default router
