import express from "express"
import cors from "cors"
import connectDB from "./config/dbconnection.js"
import "dotenv/config"
const app = express()
app.use(cors())
app.use(express.json())
await connectDB();
app.get("/", async (req, res) => {

    res.send("API working fine ")

})
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)

})


