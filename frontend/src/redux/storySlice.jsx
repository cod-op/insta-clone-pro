import { createSlice } from "@reduxjs/toolkit"

const storySlice=createSlice({
    name:"story",
    initialState:{
       storyData:null,
       storyList:null
    },
    reducers:{
        setStoryData:(state,action)=>{
            state.storyData=action.payload
        },
        setStoryList:(state,action)=>{
            state.storyList=action.payload
        },
        updateStory:(state,action)=>{
            const updatedStory=action.payload
            state.storyList=state.storyList?.map(story=>
                story._id===updatedStory._id ? updatedStory : story
            ) ?? state.storyList
            if(state.storyData?._id===updatedStory._id){
                state.storyData=updatedStory
            }
        }
    }
})

export const {setStoryData,setStoryList,updateStory}=storySlice.actions;
export default storySlice.reducer