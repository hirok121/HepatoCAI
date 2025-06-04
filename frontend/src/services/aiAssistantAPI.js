import api from './api';

// AI Assistant API service
export const aiAssistantService = {
  // Chat management
  async getChats() {
    try {
      const response = await api.get('/aiassistant/chats/');
      return {
        success: true,
        data: response.data.chats || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('Error fetching chats:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch chats',
        data: []
      };
    }
  },

  async createChat(title = null) {
    try {
      const response = await api.post('/aiassistant/chats/', {
        title: title || 'New Chat'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating chat:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create chat'
      };
    }
  },

  async getChatDetails(chatId) {
    try {
      const response = await api.get(`/aiassistant/chats/${chatId}/`);
      return {
        success: response.data.success,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching chat details:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch chat details'
      };
    }
  },

  async updateChat(chatId, updates) {
    try {
      const response = await api.patch(`/aiassistant/chats/${chatId}/`, updates);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating chat:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update chat'
      };
    }
  },

  async deleteChat(chatId) {
    try {
      await api.delete(`/aiassistant/chats/${chatId}/`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting chat:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete chat'
      };
    }
  },

  // Message management
  async sendMessage(chatId, content) {
    try {
      const response = await api.post(`/aiassistant/chats/${chatId}/messages/`, {
        message : content.trim()
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send message'
      };
    }
  },

  // User profile
  async getUserProfile() {
    try {
      const response = await api.get('/aiassistant/profile/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch profile',
        data: null
      };
    }
  },

  async updateUserProfile(updates) {
    try {
      const response = await api.patch('/aiassistant/profile/', updates);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile'
      };
    }  
  },
};

export default aiAssistantService;
