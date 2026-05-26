import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import dbConnect from './config/database.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authrouter.js'
import userRouter from './routes/userrouter.js'
import postRouter from './routes/postrouter.js'
import reelRouter from './routes/reelrouter.js'
import storyRouter from './routes/storyrouter.js'
import messageRouter from './routes/messagerouter.js'
import { app,server} from './socket.js'

dotenv.config()

const PORT = process.env.PORT || 8050
 dbConnect();


app.use(cors({
    origin: "https://insta-pro-backend.onrender.com",
    credentials: true
}))
app.use(express.json()) 
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/reel",reelRouter)
app.use("/api/story",storyRouter)
app.use("/api/message",messageRouter)

server.listen(PORT, () => {
   
    console.log(`Server is running on port ${PORT}`)
})
