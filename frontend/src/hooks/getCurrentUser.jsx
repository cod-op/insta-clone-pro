import React, { useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'

const getCurrentUser = () => {
    const dispatch=useDispatch()
    const { userData } = useSelector(state => state.user);
  useEffect(()=>{
   const fetchUser=async()=>{
    try{

     const result=await axios.get(`${backendUrl}/api/user/current`,
        {withCredentials:true})
      //   console.log("Backend Response:", result.data);
        if (result.data) {
             dispatch(setUserData(result.data.user));
             dispatch(setFollowing(result.data.user.following || [])); 
         }
         
    }catch(error){
       console.log(error);
    }
   }
   fetchUser()
 },[dispatch])
 
}

export default getCurrentUser