import axios from "../libs/axios";

// Get Profile Info
export const getProfileInfo = () => {
  return axios.post(`ProfileInfo`);
};

//Update Profile Image
export const updateProfile = (data) => {
  return axios.post(`UpdateProfile`, data);
};
