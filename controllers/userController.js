import jwt from "jsonwebtoken";
import UserModel from "../models/userSchema.js";
import bcrypt from "bcrypt"
import PasswordValidator from "password-validator"
import validator from "validator";
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
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details !" })
        }
        const ValidateEmail = validator.isEmail(email)
        console.log(ValidateEmail)
        const salt = await bcrypt.salt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new UserModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN)
        res.json({ success: true, token, user: { name: user.name } });
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}
const LoginUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.json({ success: false, message: "Missing Details!" });
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not Found !" })
        }
        const isPassMatch = await bcrypt.compare(password, user.password)
        if (isPassMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN)
            res.json({ success: true, token, user: { name: user.name } })
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
        res.json({ success: true, credits: user.creditBalance, user: { name: user?.name } })

    }
    catch (err) {

        console.log(err.message);
        res.json({ success: false, message: err.message })
    }
}
export { registerUser, LoginUser, userCreditBalance };
