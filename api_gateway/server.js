import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import config from './config/index.js';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: config.gatewayPort },
});

console.log(`🚀 Server ready at: ${url}`);
