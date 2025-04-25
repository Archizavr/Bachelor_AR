import { gql } from 'graphql-tag';

export default gql`

  type Product {
    id: ID!
    name: String
    type: String
    category: String
    brand: String
    price: Float
    stock: Int
    rating: Float
    releaseDate: String
    warrantyPeriod: String
  }

  extend type Query {
    getProduct(id: ID!): Product
    getProducts(limit: Int = 10, offset: Int = 0): ProductPage
  }

  type ProductPage {
    products: [Product]
    pageInfo: PageInfo
  }
`;
