import express from "express"
import { imageGenarator } from "../controllers/imageController.js";
import authCheck from "../middelwares/auth.js"
const router = express.Router();

router.post("/generate-image", authCheck, imageGenarator)

export default router;