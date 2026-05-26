import React, { useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setStoryList} from '../redux/storySlice'

const getAllStories = () => {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
    const {storyData}=useSelector(state=>state.story)
  useEffect(()=>{
   const fetchStories=async()=>{
    try{
      
     const result=await axios.get(`${backendUrl}/api/story/getall`,
        {withCredentials:true})

        if (result.data) {
             dispatch(setStoryList(result.data.stories));
         }
         
    }catch(error){
       console.log(error);
    }
   }
   fetchStories()
 },[userData,storyData])
 
}

export default getAllStories