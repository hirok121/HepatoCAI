import api from './api';

const userAPI = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile/me/');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      console.log('userAPI sending data:', profileData);
      const response = await api.patch('/users/profile/me/', profileData);
      console.log('userAPI received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Request data was:', profileData);
      console.error('Response error:', error.response?.data);
      throw error;
    }
  },

  // Upload profile picture (if supporting file uploads)
  updateProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await api.patch('/users/profile/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  },
};

export default userAPI;
