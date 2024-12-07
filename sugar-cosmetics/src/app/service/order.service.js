import axios from 'axios';

import { config } from '../../config/config';
  
const API_URL = `${config.REACT_APP_BASE_URL}/order`;

const OrderService = {
  //#region CRUD
  search: async (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      params.append(key, data[key]);
    });

    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  getByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
      throw error;
    }
  },


};

export default OrderService;
