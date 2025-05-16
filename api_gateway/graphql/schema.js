import { gql } from 'graphql-tag';
import userTypeDefs from '../modules/users/user.typeDefs.js';
import orderTypeDefs from '../modules/orders/order.typeDefs.js';
import productTypeDefs from '../modules/products/product.typeDefs.js';

const baseTypeDefs = gql`
  type Query
  type Mutation

  type PageInfo {
    startCursor: Int
    endCursor: Int
    totalCount: Int
    hasNextPage: Boolean
  }
`;

export default [
  baseTypeDefs,
  userTypeDefs,
  orderTypeDefs,
  productTypeDefs,
];
