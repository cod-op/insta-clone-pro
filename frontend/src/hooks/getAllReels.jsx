import axios from 'axios';
import { backendUrl } from '../App';
import { setReelData } from '../redux/reelSlice';

const getAllReels = async (dispatch) => {
  try {
    const result = await axios.get(`${backendUrl}/api/reel/getall`, { withCredentials: true });

    if (result.data.reels) {
      dispatch(setReelData(result.data.reels));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getAllReels;