import React from 'react'
import dp from '../assets/dp.png'

const NotificationCard = ({noti}) => {
  return (
    <div className='w-[90%] min-h-[50px] bg-gray-800 rounded-full px-[10px] ml-[10px] flex justify-between items-center p-[5px]'>
         <div className='flex gap-[10px] items-center'>
           <div className='w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-black'>
           <img src={noti?.sender?.profileImage || dp} className='w-full h-full object-cover'/>
         </div>

         <div className='flex flex-col'>
           <h1 className='text-white font-semibold'>{noti?.sender?.userName}</h1>
           <div className='text-gray-300 text-sm'>{noti?.message}</div>
         </div>
      </div>

         {noti?.post && (
           <div className='w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0'>
             {noti.post.mediaType === "image" ? (
            <img src={noti.post.media} className='w-full h-full object-cover' />
          ) : ( <video src={noti.post.media} className='w-full h-full object-cover' muted loop/>
         )}
         </div>
        )}
        {noti?.reel && (
           <div className='w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0'>
              <video src={noti.reel.media} className='w-full h-full object-cover' muted loop />
          </div>
        )}
    </div>
  )
}

export default NotificationCard