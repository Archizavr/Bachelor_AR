import axios from 'axios';
import config from '../../config/index.js';

const BASE = config.orderServiceUrl;

export const getOrdersByUserId = async (userId, limit, offset) => {
  const { data } = await axios.get(`${BASE}/orders`, { params: { userId, limit, offset } });
  return data;
};

export const createOrder = async (order) => {
  const { data } = await axios.post(`${BASE}/orders`, order);
  return data;
};
