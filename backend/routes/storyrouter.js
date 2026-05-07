import express from "express"
import  {uploadStory,viewStory,getStoryByUserName} from '../controllers/storycontroller'
import isAuth from "../middlewares/isAuth"
import { upload } from "../middlewares/multer.js";

const storyRouter=express.Router()

storyRouter.post("/upload",isAuth,upload.single("media"),uploadStory)
storyRouter.get("/getstorybyusername/:userName",isAuth,getStoryByUserName)
storyRouter.get("/view/:storyId",isAuth,viewStory)



export default storyRouter;