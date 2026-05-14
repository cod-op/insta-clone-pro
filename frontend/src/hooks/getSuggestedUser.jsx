import React, { useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedUsers,setUserData } from '../redux/userSlice'

const getSuggestedUser = () => {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
   const fetchUser=async()=>{
    try{
     const result=await axios.get(`${backendUrl}/api/user/suggested`,
        {withCredentials:true})
      //   console.log("Backend Response suggested user:", result.data);
       if (result.data) {
             dispatch(setSuggestedUsers(result.data.users));
         }
    }catch(error){
       console.log(error);
    }
   }
   fetchUser()
 },[userData])
 
}

export default getSuggestedUser