import axios from 'axios';
import { backendUrl } from '../App';
import { setPreviousChatUsers } from '../redux/messageSlice';

const getPreviousChatUsers = async (dispatch) => {
  try {
    const result = await axios.get(`${backendUrl}/api/message/previouschats`, { withCredentials: true });

    if (result.data) {
      dispatch(setPreviousChatUsers(result.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getPreviousChatUsers;