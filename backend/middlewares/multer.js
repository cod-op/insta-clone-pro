import multer from 'multer' 
import { randomUUID } from 'crypto'

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public')
    },
    filename:(req,file,cb)=>{
        cb(null,`${randomUUID()}-${file.originalname}`)
    }
})

export const upload=multer({storage})