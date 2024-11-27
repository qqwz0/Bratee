import axios from 'axios';

// Create an Axios instance with a centralized base URL
const api = axios.create({
  baseURL: 'http://65.109.164.243:3000/'
});

export default api;