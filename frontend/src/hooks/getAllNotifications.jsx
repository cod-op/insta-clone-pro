import React, { useEffect } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationData, setUserData } from '../redux/userSlice'

const getAllNotifications = () => {
    const dispatch=useDispatch()

    const {userData} = useSelector(state => state.user)
  
    const fetchNotifications=async()=>{
    try{

     const result=await axios.get(`${backendUrl}/api/user/getallnotifications`,
        {withCredentials:true})

        if (result.data) {
             dispatch(setNotificationData(result.data));
         }
    }catch(error){
       console.log(error);
    }
   }
   fetchNotifications()
}

export default getAllNotifications