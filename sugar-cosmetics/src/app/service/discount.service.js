import axios from 'axios';

import { config } from '../../config/config';

const baseURL = `${config.REACT_APP_BASE_URL}/discount`;

const httpOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const DiscountService = {
  // Search discounts
  search: async (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      params.append(key, data[key]);
    });

    try {
      const response = await axios.get(baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching brands:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await axios.post(baseURL, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axios.put(`${baseURL}/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting brand by ID:', error);
      throw error;
    }
  },

  // Delete a discount by ID
  delete: (id) => {
    return axios.delete(`${baseURL}/${id}`, httpOptions);
  },

  // Add a user to a discount
  addUser: (data) => {
    return axios.post(`${baseURL}/user`, data, httpOptions);
  },

  // Add a product to a discount
  addProduct: (data) => {
    return axios.post(`${baseURL}/product`, data, httpOptions);
  },

  // Add a product item to a discount
  addProductItem: (data) => {
    return axios.post(`${baseURL}/product-item`, data, httpOptions);
  }
};

export default DiscountService;
