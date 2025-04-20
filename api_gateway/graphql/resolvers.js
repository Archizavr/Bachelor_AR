import userResolvers from '../modules/users/user.resolvers.js';
import orderResolvers from '../modules/orders/order.resolvers.js';
import productResolvers from '../modules/products/product.resolvers.js';

export default {
  Query: {
    ...userResolvers.Query,
    ...orderResolvers.Query,
    ...productResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...productResolvers.Mutation,
  },
  User: userResolvers.User,
  Order: orderResolvers.Order,
};
