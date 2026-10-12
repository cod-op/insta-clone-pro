import axios from 'axios';
import { backendUrl } from '../App';
import { setFollowing } from '../redux/userSlice';

const getfollowingList = async (dispatch) => {
  try {
    const result = await axios.get(`${backendUrl}/api/user/followinglist`, { withCredentials: true });

    if (result.data) {
      dispatch(setFollowing(result.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getfollowingList;