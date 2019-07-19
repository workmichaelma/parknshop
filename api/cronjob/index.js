const express = require('express')
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty')
const map = require('lodash/map')
const _async = require('async')
const axios = require('axios');

const app = express()

const Product = require('../models/Product');
const Category = require('../models/Category');

// Connect to MongoDB
const localDB = `mongodb://mongo:27017/parknshop`
const cloudDB = `mongodb+srv://michaelma:footballwork@cluster0-s8vjq.azure.mongodb.net/parknshop?retryWrites=true&w=majority`
mongoose.connect(localDB,{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const fetchProduct = async (id, detail = false) => {
  const need = detail ? '/true' : ''
  return await axios.get(`http://crawler:8082/${id}${need}`).then(async (response) => {
    return response.data
  }).catch(err => {
    return null
  })
}

const getProduct = async (code) => {
  const target = code ? {code} : {}
  return Product.find(target, '-_id -__v').populate('categories', '-_id -__v -lastMod').then(products => {
    return products
  }).catch(err => {
    return []
  });  
}

app.get('/', async (req, res) => {
  const products = await getProduct()
  res.render('admin', { products })
});
app.get('/list/product', async (req, res) => {
  const products = await getProduct()
  res.json(products)
})
app.get('/list/category', (req, res) => {
  Category.find({}, '-_id').then(categories => {
    res.json(categories)
  }).catch(err => {
    res.status(404).json({ msg: 'No Category found' })
  });
})
app.get('/clear/category', (req, res) => {
  Category.deleteMany({}).then(categories => {
    res.json(categories)
  }).catch(err => {
    res.status(404).json({ msg: 'No Category found' })
  });
})
app.get('/clear/product', (req, res) => {
  Product.deleteMany({}).then(products => {
    res.json(products)
  }).catch(err => {
    res.status(404).json({ msg: 'No Products found' })
  });
})

const getProductCategoryIDs = async (categories) => {
  return await Promise.all(await categories.map(async c => {
    return await Category.find(c).then(async record => {
      if (isEmpty(record)) {
        const newCategory = new Category(c)
        const result = await newCategory.save()
        return result._id || null
      } else {
        return record[0]._id
      }
    })
  }))
}

const addProduct = async (code) => {
  let output = {
    done: false,
    detail: 'Product already exist'          
  }
  return Product.find({ code }).then(async products => {
    if (isEmpty(products)) {
      const product = await fetchProduct(code, true)
      if (product) {
        const categories = await getProductCategoryIDs(product.categories)
        const newProduct = new Product({
          code: product.code,
          title: product.title,
          image: product.image,
          categories,
          records: [
            {
              date: product.timestamp,
              prices: product.prices
            }
          ]
        })
        const result = await newProduct.save()
        output = {
          done: !!result._id,
          detail: result
        }
      }
    }
    return output
  })
}

app.get('/add/product/:id', async (req, res) => {
  const code = req.params.id
  res.json(await addProduct(code))
})
app.post('/add/product', async (req, res) => {
  const code = req.body.id
  const result = await addProduct(code)
  if (result.done) {
    res.redirect('/cronjob')
  } else {
    res.json(result)
  }
})

const removeProduct = async (code) => {
  return Product.deleteMany({code}).then((result) => {
    return {
      done: result.deletedCount > 0,
      detail: result
    }
  })
}

app.get('/remove/product/:id', async (req, res) => {
  const code = req.params.id
  res.json(await removeProduct(code))
})
app.post('/remove/product', async (req, res) => {
  const code = req.body.id
  const result = await removeProduct(code)
  if (result.done) {
    res.redirect('/cronjob')
  } else {
    res.json(result)
  }
})

const updateProduct = async (p) => {
  return await Product.findOneAndUpdate({ code: p.code }, {
    $addToSet: {
      records: {
        date: p.timestamp,
        prices: p.prices
      },
    },
  })
}

app.get('/product', async (req, res) => {
  const result = await Product.find().then(async products => {
    try {
      return await Promise.all(products.map(async p => {
        const product = await fetchProduct(p.code)
        const newProduct = await updateProduct(product)
        return {
          done: !!newProduct._id,
          detail: newProduct
        }
      }))
    } catch (err) {
      console.log(err, '/product')
      return { done: false, detail: err }
    }
  }).catch(err => {
    return { done: false, detail: err }
  });
  res.json(result)
})

module.exports = app