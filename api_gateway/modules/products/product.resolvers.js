import { getProductById, getProducts } from './product.service.js';

export default {
  Query: {
    getProduct: (_, { id }) => getProductById(id),
    getProducts: async (_, { limit, offset }) => {
      try {
        const { products, pageInfo } = await getProducts(limit, offset);
        return { products, pageInfo };
      } catch (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
    },
  }
};
