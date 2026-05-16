import express from "express"
import  {uploadStory,viewStory,getStoryByUserName, getAllStories} from '../controllers/storycontroller.js'
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js";

const storyRouter=express.Router()

storyRouter.post("/upload",isAuth,upload.single("media"),uploadStory)
storyRouter.get("/getstorybyusername/:userName",isAuth,getStoryByUserName)
storyRouter.get("/view/:storyId",isAuth,viewStory)
storyRouter.get("/getall",isAuth,getAllStories)



export default storyRouter;