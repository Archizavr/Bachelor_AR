import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';


// Aprakstām GraphQL shēmu
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String
    email: String
    orders: [Order]
  }

  type Order {
    id: ID!
    userId: ID!
    product: String
    # products: [Product]
    amount: Float
  }
  
  type Product {
    id: ID!
    productName: String
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
    getOrders(userId: ID!): [Order]
    getProduct: [Product]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    createOrder(userId: ID!, product: String!, amount: Float!): Order
  }
`;

// Resolvēri (angl. resolvers) nosaka, kā izvilkt tipus, kuri ir aprakstīti shēmā
const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      // Saņēmam lietotāju no REST API
      const userResponse = await axios.get(`http://localhost:4001/users/${id}`);
      const user = userResponse.data;

      // Saņēmam pasūtījumus no lietotājiem
      const ordersResponse = await axios.get(`http://localhost:4002/orders`, {
        params: { userId: user.id },
      });
      user.orders = ordersResponse.data;

      return user;
    },
    getUsers: async () => {
      const response = await axios.get(`http://localhost:4001/users`);
      return response.data;
    },
    getOrders: async (_, { userId }) => {
      const ordersResponse = await axios.get(`http://localhost:4002/orders`, {
        params: { userId },
      });
      const order = ordersResponse.data;

      // const productResponse = await axios.get(`http://localhost:4003`, {});
      // order.products
      return order;
    },
    getProduct: async () => {
        const response = await axios.get(`http://localhost:4003`, {});
        return response.data;
      },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const response = await axios.post(`http://localhost:4001/users`, { name, email });
      return response.data;
    },
    createOrder: async (_, { userId, product, amount }) => {
    // createOrder: async (_, { userId, products, amount }) => {
      const response = await axios.post(`http://localhost:4002/orders`, { userId, product, amount });
      // const response = await axios.post(`http://localhost:4002/orders`, { userId, products, amount });
      return response.data;
    },
  },
};

// Veidojam Apollo serveri
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Palaižam serveri
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
