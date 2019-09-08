const express = require('express')
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty')
const map = require('lodash/map')
const _async = require('async')
const axios = require('axios');

const app = express()

const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');

const { fetchReport } = require('../controller/Report')
const { addProduct, updateProducts } = require('../controller/Product')
const isDev = process.env.NODE_ENV === 'development'
const DB_NAME = isDev ? 'test' : 'parknshop'

// Connect to MongoDB
const localDB = `mongodb://mongo:27017/${DB_NAME}`
const cloudDB = `mongodb+srv://michaelma:footballwork@cluster0-s8vjq.azure.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(cloudDB,{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const getProduct = async (code) => {
  const target = code ? {code} : {}
  return Product.find(target, '-__v').populate({ path: 'categories', select: '-__v -lastMod' }).populate({ path: 'brands', select: '-__v -lastMod' }).then(products => {
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
app.get('/list/brand', (req, res) => {
  Brand.find({}, '-_id').then(brands => {
    res.json(brands)
  }).catch(err => {
    res.status(404).json({ msg: 'No Brand found' })
  });
})
app.get('/clear/brand', (req, res) => {
  Brand.deleteMany({}).then(brands => {
    res.json(brands)
  }).catch(err => {
    res.status(404).json({ msg: 'No Brand found' })
  });
})
app.get('/clear/product', (req, res) => {
  Product.deleteMany({}).then(products => {
    res.json(products)
  }).catch(err => {
    res.status(404).json({ msg: 'No Products found' })
  });
})
app.get('/add/product/:id', async (req, res) => {
  const code = req.params.id
  res.json(await addProduct(code))
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

app.get('/product', async (req, res) => {
  res.json(await updateProducts())
})

app.get('/report/:day', async (req, res) => {
  const day = req.params.day
  res.json(await fetchReport(day))
})

module.exports = app