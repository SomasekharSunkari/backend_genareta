import express from "express"
import { LoginUser, razorpayPayment, registerUser, userCreditBalance, verifyRazorpay } from "../controllers/userController.js"
import userAuth from "../middelwares/auth.js"

const router = express.Router()


router.post("/signup", registerUser)
router.post("/login", LoginUser)
router.post("/pay-razorpay", userAuth, razorpayPayment)
router.get("/usercredits", userAuth, userCreditBalance)
router.post("/verify-payment", verifyRazorpay)

export default router;