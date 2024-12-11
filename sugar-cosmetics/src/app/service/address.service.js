import axios from 'axios';

import { config } from '../../config/config';

const API_URL = `${config.REACT_APP_BASE_URL}/address`

const AddressService = {


    getProvinces: async () => {
        const res = await axios.get(`${API_URL}/provinces`);
        return res.data;
    },

    getDistricts: async (provinceId) => {
        const res = await axios.get(`${API_URL}/districts?provinceId=${provinceId}`);
        return res.data;
    },

    getWards: async (districtId) => {
        const res = await axios.get(`${API_URL}/wards?districtId=${districtId}`);
        return res.data;
    },

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
            console.error('Error searching brands:', error);
            throw error;
        }
    },

    addAddressUser: async (data) => {
        const res = await axios.post(`${API_URL}/user`, data);
        return res.data;
    },

    getByUserId: async (userId) => {
        const res = await axios.get(`${API_URL}/user/${userId}`);
        return res.data;
    },

    deleteAddress: async (id) => {
        const res = await axios.delete(`${API_URL}/${id}`);
        return res.data;
    },

    setAsDefault: async (userId, addressId) => {
        const res = await axios.put(`${API_URL}/${userId}/${addressId}`);
        return res.data;
    },

};

export default AddressService;
