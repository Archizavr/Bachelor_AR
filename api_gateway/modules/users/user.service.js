import axios from 'axios';
import config from '../../config/index.js';

const BASE = config.userServiceUrl;

export const getUserById = async (id) => {
  const { data } = await axios.get(`${BASE}/users/${id}`);
  return data;
};

export const getUsers = async (limit = 10, offset = 0) => {
  const { data } = await axios.get(`${BASE}/users`, {
    params: { limit, offset },
  });
  return data;
};

export const createUser = async (user) => {
  const { data } = await axios.post(`${BASE}/users`, user);
  return data;
};
