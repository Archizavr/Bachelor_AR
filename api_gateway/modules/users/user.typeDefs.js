import { gql } from 'graphql-tag';

export default gql`
  type User {
    id: ID!
    name: String
    email: String
    # orders: [Order]
    orders(limit: Int = 10, offset: Int = 0): OrderPage
  }

  extend type Query {
    getUser(id: ID!): User
    getUsers(limit: Int = 10, offset: Int = 0): UserPage
  }

  extend type Mutation {
    createUser(name: String!, email: String!, password: String!): User
  }

  type UserPage {
    users: [User]
    pageInfo: PageInfo
  }
`;
