import { createSlice } from "@reduxjs/toolkit"

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        suggestedUsers:null,
        profileData:null,
        following:[],
        searchData:null,
        notificationData:[]
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        appendUserStories:(state,action)=>{
            if(!state.userData) return
            const stories=new Map((state.userData.stories || []).map(story=>[story._id,story]))
            action.payload.forEach(story=>stories.set(story._id,story))
            state.userData.stories=[...stories.values()]
            state.userData.story=action.payload[action.payload.length-1] || state.userData.story
        },
     setSuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload
        },  
    setProfileData:(state,action)=>{
        state.profileData=action.payload
    },
    setSearchData:(state,action)=>{
        state.searchData=action.payload
    },
    setFollowing:(state,action)=>{
        state.following=action.payload
    },
     setNotificationData:(state,action)=>{
        state.notificationData=action.payload
    },
    toggleFollow:(state,action)=>{
        const targetUserId=action.payload
        if(state.following.includes(targetUserId)){
          state.following=state.following.filter(id=>id!=targetUserId)
        }
        else{
            state.following.push(targetUserId)
        }
    }
    }
})

export const {setUserData,appendUserStories,setSuggestedUsers,setProfileData,setFollowing,toggleFollow,setSearchData,setNotificationData}=userSlice.actions;
export default userSlice.reducer