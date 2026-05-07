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

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8050
 dbConnect();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json()) 
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/post",reelRouter)
app.use("/api/story",storyRouter)

app.listen(PORT, () => {
   
    console.log(`Server is running on port ${PORT}`)
})