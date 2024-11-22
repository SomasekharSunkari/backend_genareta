import UserModel from "../models/userSchema.js";
import FormData from "form-data";
import axios from "axios"
export const imageGenarator = async (req, res) => {
    try {
        const { userId, prompt } = req.body; sss
        const user = await UserModel.findById(userId)
        if (!user || !prompt) {
            return res.json({ success: false, message: "Missing Details !" });

        }

        if (user.creditBalance == 0 || user.creditBalance < 0) {
            return res.json({ success: false, message: "No Credit Balance !", creditBalance: user.creditBalance })
        }
        const formdata = new FormData();
        formdata.append("prompt", prompt);
        const { data } = axios.post("https://clipdrop-api.co/text-to-image/v1", formdata, {
            headers: {
                'x-api-key': process.env.CLIP_BOARD_API
            },
            responseType: 'arraybuffer'
        })
        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`

        await UserModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })
        return res.json({ success: true, message: "Image Generated", creditBalance: user.creditBalance - 1, resultImage })
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message })

    }
}