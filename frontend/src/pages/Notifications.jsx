import React, { useCallback, useEffect } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NotificationCard from '../components/NotificationCard';
import axios from 'axios';
import { backendUrl } from '../App';
import { setNotificationData } from '../redux/userSlice';

const Notifications = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {notificationData}=useSelector(state=>state.user);

    const fetchNotifications = useCallback(async () => {
      try {
        const result = await axios.get(`${backendUrl}/api/user/getallnotifications`, { withCredentials: true });
        if (result.data) {
          dispatch(setNotificationData(result.data));
        }
      } catch (error) {
        console.log(error);
      }
    }, [dispatch]);

    useEffect(() => {
      const markAsRead = async () => {
        try {
          const ids = notificationData.map((n) => n._id);

          if (ids.length === 0) return;

          await axios.post(`${backendUrl}/api/user/markasread`, { notificationId: ids }, { withCredentials: true });
          fetchNotifications();
        } catch (error) {
          console.log(error);
        }
      };

      markAsRead();
    }, [fetchNotifications, notificationData]);

   
  return (
    <div className='w-full h-[100vh] bg-black'>
        <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px] lg:hidden' ><IoArrowBackSharp onClick={()=>navigate(`/`)} className='text-white w-[25px] h-[25px] cursor-pointer '/>
          <h1 className='text-white text-[20px] font-semibold'>Notifications</h1>
        </div>

        <div className='w-full h-[100%] overflow-auto flex flex-col gap-[20px]'>
           {notificationData?.map((noti)=>(
            <NotificationCard noti={noti} key={noti._id || noti.id}/>
           ))}
        </div>
    </div>
  )
}

export default Notifications