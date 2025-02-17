import jwt from "jsonwebtoken";
const authCheck = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized ! Login again to Continue !" })
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_TOKEN)

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;
        }
        else {
            return res.json({ success: false, message: "Not Authorized ! Login again to Continue !" })
        }
        next();
    }
    catch (err) {
        console.log(err.message)
        res.json({ success: false, message: err.message })

    }
}

export default authCheck;