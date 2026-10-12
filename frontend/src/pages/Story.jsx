import axios from 'axios'
import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { backendUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setStoryData } from '../redux/storySlice'
import StoryCard from '../components/StoryCard'

const Story = () => {
  const {userName}=useParams()
  const dispatch=useDispatch()
  const handleStory = useCallback(async () => {
     try {
      const result=await  axios.get(`${backendUrl}/api/story/getstorybyusername/${userName}`,{withCredentials:true})
     console.log("storydata : ",result);
     dispatch(setStoryData(result?.data?.story[0]))
     }catch(error){
      console.log("Error fetching story:", error)
     }
  }, [dispatch, userName]);

  useEffect(()=>{
    if(userName){
      handleStory();
    }
  },[handleStory, userName])


  return (
    <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
       <StoryCard/>
    </div>
  )
}

export default Story