import mongoose, { mongo } from "mongoose";

const ImagesModel = new mongoose.Schema({
    user: { type: String, required: true },
    uri: { type: String, required: true }
}, {
    timestamps: true
})

const Image = new mongoose.model("Image", ImagesModel)

export default Image;