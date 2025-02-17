import mongoose from "mongoose"

const connectDB = async () => {
    mongoose.connection.on("connected", (err) => {
        if (err) throw new Error("Error Happend !");
        console.log("Database Connceted !")
    })
    await mongoose.connect(process.env.MONGO_URI)
}
export default connectDB;