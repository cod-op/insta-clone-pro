import React, { useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'

const getfollowingList = () => {
    const dispatch=useDispatch()
    const { userData } = useSelector(state => state.user);
    const {storyData}=useSelector(state=>state.story)
  useEffect(()=>{
   const fetchUser=async()=>{
    try{

     const result=await axios.get(`${backendUrl}/api/user/followinglist`,
        {withCredentials:true})

        if (result.data) {
             dispatch(setFollowing(result.data));
         }
         
    }catch(error){
       console.log(error);
    }
   }
   fetchUser()
 },[dispatch,storyData])
 
}

export default  getfollowingList