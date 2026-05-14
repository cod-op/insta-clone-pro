import React, { useEffect, useRef, useState } from 'react'
import {FaVolumeMute , FaVolumeUp } from "react-icons/fa";

const ReelCard = ({reel}) => {

    const videoRef=useRef()
    const [isPlaying,setIsPlaying]=useState(true)
    const [mute,setMute]=useState(false)

    const handleClick=()=>{
      if(isPlaying){
        videoRef.current.pause()
        setIsPlaying(false)
      }else{
        videoRef.current.play()
        setIsPlaying(true)
      }
    }


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
  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative'>
         <video ref={videoRef} autoPlay  loop src={reel?.media} muted={mute} className="w-full max-h-[100vh]" onClick={handleClick}/>
         <div className='absolute top-[20px] right-[20px] cursor-pointer' onClick={()=>setMute(prev=>!prev)}>
            {!mute?<FaVolumeUp className='w-[20px] h-[20px] text-white font-semibold'/>
               :<FaVolumeMute className='w-[20px] h-[20px] text-white font-semibold'/>}
         </div>
         <div></div>
    </div>
  )
}

export default ReelCard