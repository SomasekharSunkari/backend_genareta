import express from "express"
import { imageGenarator, getUserImages } from "../controllers/imageController.js";
import authCheck from "../middelwares/auth.js"
const router = express.Router();

router.post("/generate-image", authCheck, imageGenarator);
router.get("/getimages", authCheck, getUserImages);

export default router;