import axios from 'axios';

import { config } from '../../config/config';

const BASE_URL = config.REACT_APP_BASE_URL;

class UserService {

  // Search users
  async search(data) {
    try {
      const response = await axios.get(`${BASE_URL}/user`, { params: data });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Create user
  async create(data) {
    try {
      const response = await axios.post(`${BASE_URL}/user`, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Update user
  async update(data) {
    try {
      const response = await axios.put(`${BASE_URL}/user/${data.id}`, data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get user by ID
  async getById(id) {
    try {
      const response = await axios.get(`${BASE_URL}/user/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Delete user
  async delete(id) {
    try {
      const response = await axios.delete(`${BASE_URL}/user/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Block user
  async block(id) {
    try {
      const response = await axios.put(`${BASE_URL}/user/block/${id}`, {});
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Recover user
  async recover(id) {
    try {
      const response = await axios.put(`${BASE_URL}/user/recover/${id}`, {});
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Change user password
  async changePassword(data) {
    const params = new URLSearchParams();
    params.append('newPassword', data.newPassword);
    params.append('oldPassword', data.oldPassword);
    params.append('username', data.username);

    try {
      const response = await axios.put(`${BASE_URL}/me/change-password`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get discount for user
  async getDiscount(id, data) {
    try {
      const response = await axios.get(`${BASE_URL}/user/discount/${id}`, { params: data });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get user address
  async getAddress(id) {
    try {
      const response = await axios.get(`${BASE_URL}/address/user/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get user from token
  async getUserFromToken(accessToken) {
    try {
      const response = await axios.get(`${BASE_URL}/user/user-infor?accessToken=${accessToken}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Get expire time from token
  async getExpireTimeFromToken(token) {
    try {
      const response = await axios.get(`${BASE_URL}/user/expireTime`, { params: token });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server errors
      console.error('Error response:', error.response);
      throw error.response.data;
    } else if (error.request) {
      // Network errors
      console.error('Error request:', error.request);
      throw new Error('Network error');
    } else {
      // Other errors
      console.error('Error:', error.message);
      throw new Error('Unexpected error');
    }
  }
}

export default new UserService();
