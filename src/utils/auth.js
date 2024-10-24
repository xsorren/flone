// src/utils/auth.js
import axios from 'axios';

const token = localStorage.getItem('token');

const authAxios = axios.create({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default authAxios;
