import axios from 'axios';

import { config } from '../../config/config';

const baseURL = `${config.REACT_APP_BASE_URL}/product`;

const httpOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const ProductService = {
  // Search products
  search: async (data) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      params.append(key, data[key]);
    });

    try {
      const response = await axios.get(baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching categories:', error);
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
      console.error('Error creating category:', error);
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
      console.error('Error updating category:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting category by ID:', error);
      throw error;
    }
  },

  // Delete a product by ID
  delete: (id) => {
    return axios.delete(`${baseURL}/${id}`, httpOptions);
  },

  // Delete a single image by ID
  deleteImage: (id) => {
    return axios.delete(`${baseURL}/image/${id}`, httpOptions);
  },

  // Delete multiple images
  deleteMultiImage: (ids) => {
    return axios.delete(`${baseURL}/images`, { data: ids, ...httpOptions });
  },

  // Change the main photo of a product
  changePhoto: (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return axios.put(`${baseURL}/photo/${id}`, formData);
  },

  // Change multiple images of a product
  changeImage: (id, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return axios.put(`${baseURL}/images/${id}`, formData);
  }
};

export default ProductService;
