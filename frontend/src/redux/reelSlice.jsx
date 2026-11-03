import { createSlice } from "@reduxjs/toolkit"

const reelSlice=createSlice({
    name:"reel",
    initialState:{
       reelData:[],
    },
    reducers:{
        setReelData:(state,action)=>{
            state.reelData=action.payload
        },
        removeReel:(state,action)=>{
            state.reelData=state.reelData.filter(reel=>reel._id!==action.payload)
        }
    }
})

export const {setReelData,removeReel}=reelSlice.actions;
export default reelSlice.reducer