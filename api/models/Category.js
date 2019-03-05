const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Update = require('./update')

const CategorySchema = new Schema({
  title: String,
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

CategorySchema.plugin(Update)

module.exports = Category = mongoose.model('Category', CategorySchema);