import axios from 'axios';
import { backendUrl } from '../App';
import { setSuggestedUsers } from '../redux/userSlice';

const getSuggestedUser = async (dispatch) => {
  try {
    const result = await axios.get(`${backendUrl}/api/user/suggested`, { withCredentials: true });

    if (result.data) {
      dispatch(setSuggestedUsers(result.data.users));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getSuggestedUser;