import { gql } from 'graphql-tag';

export default gql`
  type Order {
    id: ID!
    userid: ID
    products(limit: Int = 10, offset: Int = 0): ProductPage
    amount: Float
  }

  extend type Query {
    getOrders(userId: ID, limit: Int = 10, offset: Int = 0): OrderPage
  }

  extend type Mutation {
    createOrder(userId: ID!, products: [String!]!, amount: Float!): Order
  }

  type OrderPage {
    orders: [Order]
    pageInfo: PageInfo
  }
`;
