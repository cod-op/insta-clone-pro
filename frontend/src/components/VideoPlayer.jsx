import React, { useRef, useState ,useEffect} from 'react'
import {FaVolumeMute , FaVolumeUp } from "react-icons/fa";


const VideoPlayer = ({media}) => {

const videoTag=useRef()
const [mute,setMute]=useState(false)
const [isPlaying,setIsPlaying]=useState(true)

const handleClick=()=>{
    if(isPlaying){
        videoTag.current.pause()
        setIsPlaying(false)
    }else{
        videoTag.current.play()
        setIsPlaying(true)
    }
}

useEffect(()=>{
      const video = videoTag.current;
      if (!video) return undefined;

      const observer=new IntersectionObserver((entries)=>{
        const entry=entries[0]
        if(entry.isIntersecting){
          video.play()
          setIsPlaying(true)
        }
        else {
            video.pause()
            setIsPlaying(false)
          }
      },{threshold:0.6})

      observer.observe(video)
      return ()=>{
        observer.unobserve(video)
      }
    },[])

  return (
    <div className='w-full max-w-full max-h-[75vh] relative cursor-pointer rounded-2xl overflow-hidden'>
        <video onClick={handleClick} src={media} autoPlay loop  muted={mute} ref={videoTag} 
           className="block w-full max-w-full max-h-[75vh] object-contain rounded-2xl cursor-pointer"></video>
        <div className='absolute bottom-[10px] right-[10px]' onClick={()=>setMute(prev=>!prev)}>
            {!mute?<FaVolumeUp className='w-[20px] h-[20px] text-white font-semibold'/>
            :<FaVolumeMute className='w-[20px] h-[20px] text-white font-semibold'/>}
        </div>
    </div>
  )
}

export default VideoPlayer