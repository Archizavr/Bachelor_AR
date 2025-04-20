import * as orderService from './order.service.js';
import { getProducts } from '../products/product.service.js';

export default {
  Query: {
    getOrders: async (_, { userId, limit, offset }) => {
      try {
        const { orders, pageInfo } = await orderService.getOrdersByUserId(userId, limit, offset);
        return { orders, pageInfo };
      } catch (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    },
  },
  Mutation: {
    createOrder: (_, args) => orderService.createOrder(args),
  },
  Order: {
    products: async (parent, { limit, offset }) => {
      const { products, pageInfo } = await getProducts(limit, offset, parent.products);

      return {products: parent.products.map(productId => products.find(p => parseInt(p.id) === parseInt(productId))).filter(Boolean),
        pageInfo
      };
    }
  }
};
