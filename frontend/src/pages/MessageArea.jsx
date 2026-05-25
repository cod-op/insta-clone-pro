import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import dp from '../assets/dp.png'
import { FaImage } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import SenderMesage from '../components/SenderMesage';
import ReceiverMessage from '../components/ReceiverMessage';
import axios from 'axios';
import { backendUrl } from '../App';
import { setMessages ,setSelectedUser} from '../redux/messageSlice';
import EmojiPicker from "../components/EmojiPicker";

const MessageArea = () => {
    const {selectedUser,messages}=useSelector(state=>state.message)
    const {userData}=useSelector(state=>state.user)
    const navigate=useNavigate()
    const [input,setInput]=useState("")
    const imageInput=useRef()
    const [frontendImage,setFrontendImage]=useState(null)
    const [backendImage,setBackendImage]=useState(null)
    const dispatch=useDispatch()

    const handleImage=(e)=>{
      const file=e.target.files[0]
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }

    const handleSendMessage = async(e)=>{
       e.preventDefault() 
       try{
         const formData=new FormData()
         formData.append("message",input)
         if(backendImage){
           formData.append("image",backendImage)
         }
        const result=await axios.post(`${backendUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
        console.log("message response ",result.data)
        dispatch(setMessages([...messages, result.data]))
        setInput('')
        setBackendImage(null)
        setFrontendImage(null)
       }catch(error){
        console.log(error); 
    }
   }



   const getAllMessages=async()=>{
       if (!selectedUser?._id) return;
      try{
        const result=await axios.get(`${backendUrl}/api/message/getall/${selectedUser._id}`,{withCredentials:true})
        console.log("getallmesssasge",result.data)
        dispatch(setMessages(result.data))
      }catch(error){
        console.log(error)
      }
   }


  useEffect(() => {
   if (selectedUser?._id) {
      getAllMessages();
   }
}, [selectedUser]);

  return (
    <div className='w-full h-[100vh] bg-black relative'>
        <div className='w-full flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-black'>
           <div className='h-[80px]  flex items-center gap-[20px] px-[20px]' >
              <IoArrowBackSharp onClick={()=>navigate(`/`)} className='text-white w-[25px] h-[25px] cursor-pointer '/>    
           </div>
           <div onClick={()=>navigate(`/profile/${selectedUser?.userName}`)} className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
             <img src={selectedUser?.profileImage || dp} alt="" className='w-full object-cover' />
           </div> 
           <div className='text-white text-[18px] font-semibold'>
              <div>{selectedUser?.userName}</div>
              <div className='text-[14px] text-gray-400'>{selectedUser?.name}</div>
           </div>    
        </div>

        <div className='w-full h-[80%] pt-[100px] pb-[80px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-black'>
           {messages && messages.map((mess,index)=>(
              mess.sender===userData?._id ? <SenderMesage message={mess} key={mess._id}/>: < ReceiverMessage message={mess} key={mess._id}/>
           ))}
        </div>

        <div className='w-full flex justify-center items-center h-[80px] fixed bottom-0 z-[100] bg-black'>
            <form onSubmit={handleSendMessage} className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative'>
               {frontendImage && 
                  <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'>
                    <img src={frontendImage} alt="" className='h-full object-cover'/>
                  </div>
               }
               <EmojiPicker setValue={setInput} tailwind={'w-[25px] h-[25px] text-white cursor-pointer'}/>
               <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='message' className='w-full h-full px-[20px] text-[18px] text-white outline-0'/>
               <input onChange={handleImage}  type="file" accept='image/*' hidden ref={imageInput} />
               <div onClick={()=>imageInput.current.click()}><FaImage className='w-[28px] h-[28px] text-white cursor-pointer'/></div>
               {(input || frontendImage) &&
                <button className='w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center cursor-pointer'><IoSend className='w-[28px] h-[28px] text-white'/></button>
               }
            </form>
        </div>
    </div>
  )
}

export default MessageArea