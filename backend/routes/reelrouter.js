import express from "express"
import  {getAllReels,uploadReel,like,comment} from '../controllers/reelcontroller'
import isAuth from "../middlewares/isAuth"
import { upload } from "../middlewares/multer.js";

const reelRouter=express.Router()

postRouter.post("/upload",isAuth,upload.single("media"),uploadReel)
postRouter.get("/getall",isAuth,getAllReels)
postRouter.get("/like/:reelId",isAuth,like)
postRouter.post("/comment/:reelId",isAuth,comment)  


export default reelRouter;