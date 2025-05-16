import * as userService from './user.service.js';
import { getOrdersByUserId } from '../orders/order.service.js';

export default {
  Query: {
    getUser: async (_, { id }) => {
      try {
        return await userService.getUserById(id);
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
    getUsers: async (_, { limit, offset }) => {
      try {
        const { users, pageInfo } = await userService.getUsers(limit, offset);
        return { users, pageInfo };
      } catch (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
    },
  },
  Mutation: {
    createUser: async (_, args) => {
      try {
        return await userService.createUser(args);
      } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
    },
  },
  User: {
    orders: async (parent) => {
      try {
        return await getOrdersByUserId(parent.id);
      } catch (error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    },
  },
};