import jwt from "jsonwebtoken";
import UserModel from "../models/userSchema";
import bcrypt from "bcrypt"

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details !" })
        }
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