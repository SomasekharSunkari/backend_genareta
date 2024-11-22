import express from "express"
import cors from "cors"
import connectDB from "./config/dbconnection.js"
import "dotenv/config"
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoutes.js"
const app = express()
app.use(cors())
await connectDB();
app.use(express.json())
app.use("/api/user", userRouter)
app.use("/api/image", imageRouter)
app.get("/", async (req, res) => {
    res.send("API working fine ")
})
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})


