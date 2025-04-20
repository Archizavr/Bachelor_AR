import axios from 'axios';
import config from '../../config/index.js';

const BASE = config.productServiceUrl;

export const getProducts = async (limit = 10, offset = 0) => {
  const { data } = await axios.get(`${BASE}/products`, {
    params: { limit, offset },
  });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await axios.get(`${BASE}/products/${id}`);
  return data;
};
