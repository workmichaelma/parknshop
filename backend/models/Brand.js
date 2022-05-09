const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BrandSchema = new Schema({
  image: String,
  name: String,
})

BrandSchema.statics.getBrandIdOrWillCreate = async ({ name, image }) => {
  try {
    const { _id } = (await Brand.findOne({ name })) || {}

    if (!_id) {
      const result = await Brand.create({
        name,
        image,
      })
      if (result._id) {
        return result._id
      }
    } else {
      return _id
    }
    return ''
  } catch (err) {
    console.log('BrandSchema.statics.getBrandIdOrWillCreate Failed')
    return {}
  }
}

const Brand = mongoose.model('brand', BrandSchema)
module.exports = Brand
