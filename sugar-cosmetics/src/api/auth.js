import axios from 'axios';

import { config } from '../config/config';
const BASE_URL = config.REACT_APP_BASE_URL;

const authService = {
    login: async (data) => {
        return axios.post(`${BASE_URL}/auth/login`, data);
    },
    register: async (data) => {
        return axios.post(`${BASE_URL}/auth/register`, data);
    }
}

export default authService;
