import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios';

const serverUserName = process.env.SRVC_USER_NAME || 'localhost';
const serverUserPort = process.env.SRVC_USER_PORT || 4001;

const serverOrderName = process.env.SRVC_ORDER_NAME || 'localhost';
const serverOrderPort = process.env.SRVC_ORDER_PORT || 4002;

const serverProductName = process.env.SRVC_PRODUCT_NAME || 'localhost';
const serverProductPort = process.env.SRVC_PRODUCT_PORT || 4003;

const PORT = process.env.GATEWAY_PORT || 4000;
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
    userId: ID
    products: [Product!]
    amount: Float
  }
  
  type Product {
    id: ID!
    productName: String
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
    getOrders(userId: ID): [Order]
    getProduct: [Product]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    createOrder(userId: ID!, products: [String!]!, amount: Float!): Order
    # addProductToOrder(orderId: ID!, product: Int!): Order
  }
`;

// Resolvēri (angl. resolvers) nosaka, kā izvilkt tipus, kuri ir aprakstīti shēmā
const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      // Saņēmam lietotāju no REST API
      const userResponse = await axios.get(`http://${serverUserName}:${serverUserPort}/users/${id}`);
      const user = userResponse.data;

      // Saņēmam pasūtījumus no lietotājiem
      const ordersResponse = await axios.get(`http://${serverOrderName}:${serverOrderPort}/orders`, {
        params: { userId: user.id },
      });
      user.orders = ordersResponse.data;

      return user;
    },
    getUsers: async () => {
      const response = await axios.get(`http://${serverUserName}:${serverUserPort}/users`);
      return response.data;
    },
    getOrders: async (_, { userId }) => {
      const ordersResponse = await axios.get(`http://${serverOrderName}:${serverOrderPort}/orders`, {
        params: { userId },
      });
      const orders = ordersResponse.data;
      // return orders;
      // // console.log(orders);
      const productResponse = await axios.get(`http://${serverProductName}:${serverProductPort}/products`, {});
      const products = productResponse.data;
      // // console.log(products);

      const enrichedOrders = orders.map(order => {
        const enrichedProducts = order.products.map(productId => {
          const product = products.find(p => p.id === productId);
          return product ? { id: product.id, productName: product.productName } : null;
        }).filter(Boolean)
          
          return {
            ...order,
            products: enrichedProducts,
          };
        });

      return enrichedOrders;
    },

    getProduct: async () => {
        const response = await axios.get(`http://${serverProductName}:${serverProductPort}/products`, {});
        console.log('getProduct');
        return response.data;
      },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const response = await axios.post(`http://${serverUserName}:${serverUserPort}/users`, { name, email });
      return response.data;
    },
    createOrder: async (_, { userId, products, amount }) => {
      const response = await axios.post(`http://${serverOrderName}:${serverOrderPort}/orders`, { userId, products, amount });
      return response.data;
    },
    // addProductToOrder: async (_, { orderId, product }) => {
    //   const response = await axios.put(`http://${serverOrderName}:${serverOrderPort}/orders/${orderId}/product`,{ product });
    //   // const ordersResponse = await axios.put(`http://${serverOrderName}:${serverOrderPort}/orders/${orderId}/product`,{ product });
    //   // const orders = ordersResponse.data;
    //   // // console.log(orders);
    //   // const productResponse = await axios.get(`http://${serverProductName}:${serverProductPort}/products`, {});
    //   // const products = productResponse.data;
    //   // // console.log(products);

    //   // const enrichedOrders = orders.map(order => {
    //   //   const enrichedProducts = order.products.map(productId => {
    //   //     const productUnit = products.find(p => p.id === productId);
    //   //     return productUnit ? { id: productUnit.id, productName: productUnit.productName } : null;
    //   //   }).filter(Boolean); 

    //   //   return {
    //   //     ...order,
    //   //     products: enrichedProducts,
    //   //   };
    //   // });

    //   // return enrichedOrders;
    //   return response.data;
    // },
  },
};

// Veidojam Apollo serveri
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Palaižam serveri
const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});

console.log(`🚀 Server ready at: ${url}`);
