import mongoose from "mongoose";

const transactionModel = new mongoose.Schema({
    userId: { type: String, required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    date: { type: Number }

})

const transaction = mongoose.models.transaction || mongoose.model("transaction", transactionModel)
export default transaction;