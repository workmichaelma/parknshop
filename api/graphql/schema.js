const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Category {
    _id: ID
    title: String
    code: String
    url: String
  }

  type Brand {
    _id: ID
    title: String
    code: String
    url: String
  }

  type ProductPrice {
    amount: Int
    value: String
  }

  type ProductRecord {
    date: String
    prices: [ProductPrice]
  }

  type Product {
    _id: ID!
    code: String!
    title: String!
    image: String!
    categories: [Category!]
    brands: [Brand!]
    records: [ProductRecord!]
  }

  input ProductFilter {
    brand: [ID]
    category: [ID]
  }

  type ClearResult {
    Product: Int
    Category: Int
    Brand: Int
  }

  type RootQuery {
    product(code: String, _id: ID, filter: ProductFilter, page: Int = 0): [Product!]
    category(_id: ID): [Category]
    brand(_id: ID): [Brand]
  }

  type RootMutation {
    addSampleProduct: [Product]
    addProduct (code: String) : Product!
    updateProducts (code: String) : [Product!]
    clear: ClearResult
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)