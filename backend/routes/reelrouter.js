import express from "express"
import  {getAllReels,uploadReel,like,comment} from '../controllers/reelcontroller.js'
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js";

const reelRouter=express.Router()

reelRouter.post("/upload",isAuth,upload.single("media"),uploadReel)
reelRouter.get("/getall",isAuth,getAllReels)
reelRouter.get("/like/:reelId",isAuth,like)
reelRouter.post("/comment/:reelId",isAuth,comment)  


export default reelRouter;