import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js";
import {sendMessage,getAllMessages,getPreviousUserChats} from '../controllers/messagecontroller.js'

const messageRouter=express.Router()

messageRouter.post("/send/:senderId",isAuth,upload.single("image"),sendMessage)
messageRouter.get("/getall/:receiverId",isAuth,getAllMessages)
messageRouter.get("/previouschats",isAuth,getPreviousUserChats)

export default messageRouter;