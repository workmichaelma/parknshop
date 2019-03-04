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
  // categories: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Category'
  //   }
  // ]
  price: [
    {
      date: {
        type: String
      },
      prices: [
        {
          amount: Number,
          value: String
        }
      ]
    }
  ]
});

ProductSchema.plugin(Update)

module.exports = Product = mongoose.model('product', ProductSchema);