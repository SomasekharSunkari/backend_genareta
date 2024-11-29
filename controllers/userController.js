import jwt from "jsonwebtoken";
import UserModel from "../models/userSchema.js";
import bcrypt from "bcrypt"
import PasswordValidator from "password-validator"
import validator from "validator";
import razorpay from "razorpay";
import transaction from "../models/transactionSchema.js";
const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
const registerUser = async (req, res) => {
    try {
        console.log("I am ")
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details !" })
        }
        const ValidateEmail = validator.isEmail(email)
        console.log(ValidateEmail)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new UserModel(userData)
        const user = await newUser.save()
        console.log("I am in sugn j")
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN)
        res.json({ success: true, token, user: user.name });
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}
const LoginUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) return res.json({ success: false, message: "Missing Details!" });
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not Found !" })
        }
        const isPassMatch = await bcrypt.compare(password, user.password)
        if (isPassMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN)
            res.json({ success: true, token, user: user.name })
        }
        else {
            res.json({ success: false, message: "Invalid Credentials !" })
        }
    }
    catch (err) {
        console.log(err.message);
        res.send({ success: false, err: err.message })

    }
}
const userCreditBalance = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId)
        res.json({ success: true, credits: user.creditBalance, user: user.name })

    }
    catch (err) {

        console.log(err.message);
        res.json({ success: false, message: err.message })
    }
}
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
const razorpayPayment = async (req, res) => {
    //
    try {
        const { userId, planId } = req.body;

        const user = UserModel.findById(userId)

        if (!user || !planId) {
            return res.json({ success: false, message: "Missing Details !" })
        }
        let plan, amount, credits, date;
        switch (planId) {
            case 'Basic':
                plan = "Basic"
                amount = 10
                credits = 100
                break;
            case 'Advanced':
                plan = 'Advanced'
                amount = 50
                credits = 500
                break;
            case 'Business':
                plan = 'Business'
                amount = 100
                credits = 5000
                break;
            default:
                return res.json({ success: false, message: "Plan Not Found !" })
        }

        date = Date.now()
        const transactionData = {
            userId, plan, amount, credits, date
        };

        const newTransaction = await transaction.create(transactionData);
        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id

        }
        await razorpayInstance.orders.create(options, (error, order) => {

            if (error) {
                console.log(error)
                return res.json({ success: false, message: error })
            }
            res.json({ success: true, message: order })

        })
    }
    catch (err) {
        console.log(err.message)
        return res.json({ success: false, message: err.message })
    }
}
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch((razorpay_order_id))
        if (orderInfo.status === 'paid') {
            const transctionData = await transaction.findById(orderInfo.receipt);
            if (transctionData.payment) {
                return res.json({ success: false, message: "Payment Done Already !" })
            }
            const userData = await UserModel.findById(transctionData.userId)
            const creditBalance = userData.creditBalance + transctionData.credits;
            await UserModel.findByIdAndUpdate(userData._id, { creditBalance })
            await transaction.findByIdAndUpdate(transctionData._id, { payment: true })
            res.json({ success: true, message: "Credits Added" })
        }
        else {
            res.json({ success: false, message: "Credits Added !" })
        }
    }
    catch (err) {
        console.log(err.message)
        res.json({
            success: false, message: err.message
        })
    }
}
export { registerUser, LoginUser, userCreditBalance, razorpayPayment, verifyRazorpay };
