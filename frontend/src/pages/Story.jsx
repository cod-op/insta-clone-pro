import axios from 'axios'
import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { backendUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { setStoryData } from '../redux/storySlice'
import StoryCard from '../components/StoryCard'

const Story = () => {
  const {userName}=useParams()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {userData}=useSelector(state=>state.user)
  const [stories,setStories]=useState([])
  const [storyIndex,setStoryIndex]=useState(0)
  const [loading,setLoading]=useState(true)
  const [loadedUserName,setLoadedUserName]=useState(null)
  useEffect(()=>{
    let isCurrent=true
    const loadStories=async()=>{
      try{
        const result=await axios.get(`${backendUrl}/api/story/getstorybyusername/${userName}`,{withCredentials:true})
        if(!isCurrent) return
        const userStories=result?.data?.story || []
        setStories(userStories)
        const firstUnseenIndex=userStories.findIndex(story=>
          !story.viewers?.some(viewer=>(viewer?._id || viewer)?.toString()===userData?._id?.toString())
        )
        const initialIndex=firstUnseenIndex<0 ? 0 : firstUnseenIndex
        setStoryIndex(initialIndex)
        dispatch(setStoryData(userStories[initialIndex] || null))
        if(userStories.length===0) navigate('/')
      }catch(error){
        if(isCurrent) console.log("Error fetching story:",error)
      }finally{
        if(isCurrent){
          setLoadedUserName(userName)
          setLoading(false)
        }
      }
    }

    dispatch(setStoryData(null))
    loadStories()
    return ()=>{isCurrent=false}
  },[dispatch,navigate,userData?._id,userName])

  const showNextStory=useCallback(()=>{
    const nextIndex=storyIndex+1
    if(nextIndex<stories.length){
      setStoryIndex(nextIndex)
      dispatch(setStoryData(stories[nextIndex]))
    }else{
      dispatch(setStoryData(null))
      navigate('/')
    }
  },[dispatch,navigate,stories,storyIndex])

  return (
    <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
       {loadedUserName===userName && stories.length>0 ? <StoryCard key={stories[storyIndex]?._id} onNext={showNextStory}/> : <div className="text-white">{loading || loadedUserName!==userName?"Loading Story...":"Story unavailable."}</div>}
    </div>
  )
}

export default Story