import UserModel from "../models/userSchema.js";
import FormData from "form-data";
import axios from "axios"
import Image from "../models/Images.js";
export const imageGenarator = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        const user = await UserModel.findById(userId)
        if (!user || !prompt) {
            return res.json({ success: false, message: "Missing Details !" });
        }
        if (user.creditBalance == 0 || user.creditBalance < 0) {
            return res.json({ success: false, message: "No Credit Balance !", creditBalance: user.creditBalance })
        }
        const formdata = new FormData();
        formdata.append("prompt", prompt);
        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formdata, {
            headers: {
                'x-api-key': process.env.CLIP_BOARD_API
            },
            responseType: 'arraybuffer'
        })
        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`

        const newImage = new Image({
            user: userId,
            uri: resultImage
        });

        await newImage.save();
        await UserModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })
        return res.json({ success: true, message: "Image Generated", creditBalance: user.creditBalance - 1, resultImage })
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message })

    }
}
export const getUserImages = async (req, res) => {
    try {
        const { userId } = req.body;
        const images = await Image.find({ user: userId }).sort({ createdAt: -1 }).select("uri -_id");

        if (!images.length) {
            return res.json({ success: false, message: "No images found!" });
        }

        res.json({ success: true, images });

    } catch (err) {
        console.log(err);
        res.json({ success: false, message: err.message });
    }
};
