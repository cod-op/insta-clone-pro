import axios from 'axios';
import { backendUrl } from '../App';
import { setStoryList } from '../redux/storySlice';

const getAllStories = async (dispatch) => {
  try {
    const result = await axios.get(`${backendUrl}/api/story/getall`, { withCredentials: true });

    if (result.data) {
      dispatch(setStoryList(result.data.stories));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getAllStories;