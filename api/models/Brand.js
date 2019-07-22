const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Update = require('./update')

const BrandSchema = new Schema({
  title: String,
  code: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

BrandSchema.plugin(Update)

module.exports = Brand = mongoose.model('Brand', BrandSchema);