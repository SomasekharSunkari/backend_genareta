import express from "express"
import { LoginUser, registerUser, userCreditBalance } from "../controllers/userController.js"
import userAuth from "../middelwares/auth.js"

const router = express.Router()


router.post("/singup", registerUser)
router.post("/login", LoginUser)
router.post("/usercredits", userAuth, userCreditBalance)

export default router;