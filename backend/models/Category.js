const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  code: String,
  name: String,
})

CategorySchema.statics.getCategoryIdOrWillCreate = async ({ name, code }) => {
  try {
    const { _id } = (await Category.findOne({ code })) || {}
    if (!_id) {
      const result = await Category.create({
        code,
        name,
      })
      if (result._id) {
        return result._id
      }
    } else {
      return _id
    }
    return ''
  } catch (err) {
    console.log('CategorySchema.statics.getCategoryIdOrWillCreate Failed')
    return {}
  }
}

const Category = mongoose.model('category', CategorySchema)
module.exports = Category
