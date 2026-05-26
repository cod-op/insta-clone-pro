import React, { useEffect, useRef, useState } from 'react'
import {FaVolumeMute , FaVolumeUp } from "react-icons/fa";
import dp from '../assets/dp.png'
import { setUserData } from '../redux/userSlice';
import { setReelData } from '../redux/reelSlice';
import Follow from './Follow';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { IoIosHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa6";
import { MdOutlineComment } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import { backendUrl } from '../App';
import EmojiPicker from './EmojiPickerComponent';

const ReelCard = ({reel}) => {
    const {userData}=useSelector(state=>state.user)
    const { reelData } = useSelector(state => state.reel);
    const { socket } = useSelector(state => state.socket)
    const videoRef=useRef()
    const [isPlaying,setIsPlaying]=useState(true)
    const [mute,setMute]=useState(false)
    const [progress,setProgress]=useState(0)
    const [showHeart,setShowHeart]=useState(false)
    const [showComment,setShowComment]=useState(false)
    const [message,setMessage]=useState("")
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const commentRef=useRef()
    

    const handleTimeUpdate=()=>{
      const video=videoRef.current
      if(video){
        const percent=(video.currentTime/video.duration)*100
        setProgress(percent)
      }
    }

    const handleClick=()=>{
      if(isPlaying){
        videoRef.current.pause()
        setIsPlaying(false)
      }else{
        videoRef.current.play()
        setIsPlaying(true)
      }
    }

    const handleLike=async()=>{
      try{
         const result=await axios.get(`${backendUrl}/api/reel/like/${reel._id}`,{withCredentials:true})
         console.log("likedata : ",result)
         const updatedReel=result.data.reel;
         
         const updatedReels=reelData.map(p=>p._id==reel._id?updatedReel:p)
         dispatch(setReelData(updatedReels))
      }catch(error){
          console.log(error)
      }
    }

    const handleLikeOnDoubleClick=async()=>{
      setShowHeart(true)
      setTimeout(()=>setShowHeart(false),6000)
      {!reel?.likes?.includes(userData?._id) && handleLike()}
    }


    const handleComment=async()=>{
      try{
         const result=await axios.post(`${backendUrl}/api/reel/comment/${reel._id}`,{message},{withCredentials:true})
         console.log("commentdata : ",result)
         const updatedReel=result.data.reel;
         
         const updatedReels=reelData.map(p=>p._id==reel._id?updatedReel:p)
         dispatch(setReelData(updatedReels))
         setMessage("")
      }catch(error){
       console.log(error)
      }
    }

    useEffect(()=>{
      const handleClickOutSide=(event)=>{
          if(commentRef.current && !commentRef.current.contains(event.target)){
            setShowComment(false);
          }
      }
      if(showComment){
        document.addEventListener("mousedown",handleClickOutSide)
      }else{
        document.removeEventListener("mousedown",handleClickOutSide)
      }
    },[showComment])

    useEffect(()=>{
      const observer=new IntersectionObserver((entries)=>{
        const entry=entries[0]
        const video=videoRef.current
        if(entry.isIntersecting){
          video.play()
          setIsPlaying(true)
        }
        else {
            videoRef.current.pause()
            setIsPlaying(false)
          }
      },{threshold:0.6})

      if(videoRef.current){
        observer.observe(videoRef.current)
      }
      return ()=>{
       if(videoRef.current){
        observer.unobserve(videoRef.current)
      }
      }
    },[])

    useEffect(()=>{
       socket?.on("likedReel",(updatedData)=>{
        const updatedReels=reelData.map(p=>p._id===updatedData.reelId?{...p,likes:updatedData.likes}:p)
        dispatch(setReelData(updatedReels))
       })
       socket?.on("commentedReel",(updatedData)=>{
        const updatedReels=reelData.map(p=>p._id===updatedData.reelId?{...p,comments:updatedData.comments}:p)
        dispatch(setReelData(updatedReels))
       })
       return ()=>{socket?.off("likedReel")
          socket?.off("commentedReel")
       }
      },[socket,reelData,dispatch])

    
  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex  items-center justify-center border-l-2 border-r-2 border-gray-800 relative'>
         {showHeart && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50 overflow-hidden'>
            <FaHeart className='w-[70px] h-[70px]  text-white drop-shadow-2xl'/>
         </div>}


         <div className='relative w-full h-[100vh] flex-shrink-0'>
            <video onDoubleClick={handleLikeOnDoubleClick} ref={videoRef} autoPlay  loop src={reel?.media} muted={mute} className="w-full max-h-[100vh]" onClick={handleClick} onTimeUpdate={handleTimeUpdate}/>

         <div className='absolute top-[30px] right-[20px] cursor-pointer z-200' onClick={()=>setMute(prev=>!prev)}>
            {!mute?<FaVolumeUp className='w-[20px] h-[20px] text-white font-semibold'/>
               :<FaVolumeMute className='w-[20px] h-[20px] text-white font-semibold'/>}
         </div>

         <div className='absolute bottom-0  w-full h-[3px] bg-gray-900'>
             <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{width:`${progress}%`}}>
             </div>
         </div>

         <div className='w-full absolute h-[100px] bottom-[10px]  flex flex-col gap-y-[10px]'>
            
            <div className='flex justify-start items-center gap-[5px] md:gap-[10px]'>
                <div onClick={()=>navigate(`/profile/${reel.author?.userName}`)}  className='w-[30px] h-[30px] md:w-[50px] md:h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden ml-[10px]'>
                    <img src={reel.author?.profileImage || dp} alt="" className='w-full h-full object-cover ' />
                </div>
                <div className='w-[100px] font-semibold truncate text-white '>
                    {reel.author?.userName}
                </div>
            

              {userData._id!=reel.author._id  &&
               <Follow targetUserId={reel?.author?._id} tailwind={'px-[15px] py-[5px] bg-gray-700 flex items-center justify-center text-white border-2  rounded-2xl text-[14px] cursor-pointer'}/>
               } 
            </div>  

            <div className='text-white pl-[10px]'> {reel?.caption}</div>   

            <div className='absolute right-0 lg:right-[30px] flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px]'>
                <div onClick={handleLike} className='flex flex-col items-center cursor-pointer'>
                    {!reel?.likes?.includes(userData?._id)&& <IoIosHeartEmpty className='w-[25px] h-[25px] cursor-pointer'/>}
                    {reel?.likes?.includes(userData?._id)&& <FaHeart className='w-[25px] h-[25px] cursor-pointer text-red-600'/>}
                    <span>{reel?.likes?.length || 0}</span>
                 </div>
                <div className='flex flex-col items-center cursor-pointer'>
                    <MdOutlineComment onClick={()=>setShowComment(prev=>!prev)} className='w-[25px] h-[25px] cursor-pointer'/>
                    <span>{reel?.comments?.length || 0}</span> 
                </div>       
            </div>
         </div>  
         </div>

         <div ref={commentRef} className={`absolute bottom-0 z-[200] w-full h-[500px] p-[10px] rounded-t-3xl bg-[#0e1718] shadow-2xl shadow-black transition-transform duration-500 ease-in-out left-0 ${showComment?"translate-y-0":"translate-y-[100%] hidden"}`}>
              <h1 className='text-white text-[20px] text-center'>Comments</h1>

              <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>
                {reel?.comments?.length==0 && <div className='text-white font-semibold flex justify-center items-center  h-full'>
                    NO Comments Yet
                  </div>}
                 {reel?.comments?.map((com,index)=>(
                    <div key={index} className='w-full flex flex-col  gap-[5px] border-b border-b-gray-500 text-white  justify-center pb-[10px]'> 
                       <div className='flex justify-start items-center md:gap-[20px] gap-[10px]'>
                          <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                            <img src={com?.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                          </div>
                         <div className='w-[150px] truncate font-semibold text-white'>{com?.author?.userName}</div>
                       </div>
                       <div className='pl-[45px] md:pl-[55px] text-gray-300 text-[14px] font-semibold'>{com.message}</div>
                    </div>
                   ))}
              </div>

              <div className='w-full absolute bottom-0 left-0 h-[80px] bg-[#0e1718] flex items-center justify-between gap-[10px] px-[20px] z-[110]'>
  
    <div className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] border-2 border-gray-600 rounded-full cursor-pointer overflow-hidden flex-shrink-0'>
        <img src={userData?.profileImage || dp} alt="" className='w-full h-full object-cover text-white' />
    </div>
    
  
    <div className="flex-1 flex items-center border-b border-gray-500 h-[45px] min-w-0 px-[5px]">
        <input onChange={(e) => setMessage(e.target.value)} value={message}  type="text" placeholder='write comment...' 
            className='flex-1 bg-transparent text-white text-[14px] outline-none border-none h-full pr-2 min-w-0' onKeyDown={(e) => e.key === 'Enter' && handleComment()}/>
        <div className='flex-shrink-0 flex items-center justify-center'>
            <EmojiPicker setValue={setMessage} tailwind={"w-[24px] h-[24px] text-white cursor-pointer ml-2"} />
        </div>
    </div>

    <button onClick={handleComment} className='w-[40px] h-[40px] flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-90 transition-transform'>
       <IoSend className='w-[22px] h-[22px] text-white'/>
    </button>
</div>
         </div>

    </div>
  )
}

export default ReelCard