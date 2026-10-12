import axios from 'axios';
import { backendUrl } from '../App';
import { setUserData } from '../redux/userSlice';

const getCurrentUser = async (dispatch) => {
  try {
    const result = await axios.get(`${backendUrl}/api/user/current`, { withCredentials: true });

    if (result.data) {
      dispatch(setUserData(result.data.user));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentUser;