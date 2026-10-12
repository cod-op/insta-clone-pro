import axios from 'axios';
import { backendUrl } from '../App';
import { setNotificationData } from '../redux/userSlice';

const getAllNotifications = async (dispatch) => {
  try {
    const result = await axios.get(`${backendUrl}/api/user/getallnotifications`, { withCredentials: true });

    if (result.data) {
      dispatch(setNotificationData(result.data));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getAllNotifications;