import express from "express"
import {uploadPost,getAllPost,like,comment,saved} from '../controllers/postcontroller.js'
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js";

const postRouter=express.Router()

postRouter.post("/upload",isAuth,upload.single("media"),uploadPost)
postRouter.get("/getall",isAuth,getAllPost)
postRouter.get("/like/:postId",isAuth,like)
postRouter.get("/saved/:postId",isAuth,saved)
postRouter.post("/comment/:postId",isAuth,comment)  


export default postRouter;