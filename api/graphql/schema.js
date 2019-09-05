const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Category {
    _id: ID
    title: String
    code: String
    url: String
    products: [Product]
  }

  type Brand {
    _id: ID
    title: String
    code: String
    url: String
    products: [Product]
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
    sale: [Int]
  }

  type AddProduct {
    product: Product
    success: Boolean
    msg: String
  }

  type PreviewProduct {
    code: String!
    title: String!
    image: String!
    prices: [ProductPrice!]
  }

  type Report {
    product: Product!
    records: [ReportRecord]
  }

  type ReportRecord {
    amount: Int
    value: Float
    average: Float
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
    product(code: String, day: Int = 7, _id: ID, filter: ProductFilter, page: Int = 0): [Product!]
    category(_id: ID, title: String): [Category!]
    brand(_id: ID, title: String): [Brand]
    report(day: Int = 2): [Report!]
    previewProduct(code: String, url: String): PreviewProduct!
  }

  type RootMutation {
    addSampleProduct: [Product]
    addProduct (code: String) : AddProduct!
    updateProducts (code: String): [Product!]
    clear: ClearResult
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)