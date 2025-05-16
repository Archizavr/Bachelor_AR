import * as orderService from './order.service.js';
import { getProducts, getProductById } from '../products/product.service.js';

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
      const products = await Promise.all(
        parent.products.map(async (productId) => {
          try {
            return await getProductById(productId);
          }
          catch (error) {
            console.error(`Error fetching product with ID ${productId}:`, error);
            return null;
          }
        }
      ));

      const filteredProducts = products.filter(Boolean);

      // Create pageInfo manually (pagination logic should match your requirements)
      const pageInfo = {
          total: filteredProducts.length,
          limit,
          offset,
      };

      return {
          products: filteredProducts,
          pageInfo,
      };

      // return {products: parent.products.map(productId => products.find(p => parseInt(p.id) === parseInt(productId))).filter(Boolean),
      //   pageInfo
      // };
    }
  }
//   Order: {
//     products: async (parent, { limit, offset }) => {
//         // Fetch product details for each product ID in the order
//         console.log(parent);

//         const products = await Promise.all(
//             parent.products.map(async (productId) => {
//                 try {
//                   console.log(productId)
//                     return await getProductById(productId);
//                 } catch (error) {
//                     console.error(`Error fetching product with ID ${productId}:`, error);
//                     return null;
//                 }
//             })
//         );

//         // Filter out any null responses due to errors
//         const filteredProducts = products.filter(Boolean);

//         // Create pageInfo manually (pagination logic should match your requirements)
//         const pageInfo = {
//             total: filteredProducts.length,
//             limit,
//             offset,
//         };

//         return {
//             products: filteredProducts,
//             pageInfo,
//         };
//     },
// }

};
