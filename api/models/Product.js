const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Update = require('./update')

const ProductSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  title: String,
  image: String,
  sale: [
    Number
  ],
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  brands: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Brand'
    }
  ],
  records: [
    {
      _id: false,
      date: {
        type: String
      },
      prices: [
        {
          _id: false,
          amount: Number,
          value: String
        }
      ]
    }
  ]
});

ProductSchema.plugin(Update)

module.exports = Product = mongoose.model('product', ProductSchema);