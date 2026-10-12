import axios from 'axios';
import { backendUrl } from '../App';
import { setPostData } from '../redux/postSlice';

const getAllPost = async (dispatch) => {
  try {
    const result = await axios.get(`${backendUrl}/api/post/getall`, { withCredentials: true });

    if (result.data.posts) {
      dispatch(setPostData(result.data.posts));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getAllPost;