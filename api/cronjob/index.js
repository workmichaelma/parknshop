const express = require('express')
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty')
const map = require('lodash/map')
const _async = require('async')
const axios = require('axios');

const app = express()

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/parknshop',{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const getProduct = async (id, detail = false) => {
  const need = detail ? '/true' : ''
  return await axios.get(`http://crawler:8082/${id}${need}`).then(async (response) => {
    return response.data
  })  
}

app.get('/product', (req, res) => {
  Product.find().then(products => {
    try {
      const calls = map(products, (p) => {
        if (p.title) {
          return getProduct(p.code)
        } else {
          return getProduct(p.code, true)
        }
      })
      Promise.all(calls).then((result) => {
        res.json(result)
      })
    } catch (err) {
      console.log(err, '/product')
      res.json({err})
    }

  }).catch(err => {
    res.status(404).json({ msg: 'No items found' })
  });
})
app.get('/listproduct', (req, res) => {
  Product.find().then(products => {
    res.json(products)
  }).catch(err => {
    res.status(404).json({ msg: 'No Products found' })
  });
})
app.get('/add/product/:id', (req, res) => {
  const code = req.params.id
  Product.find({code}).then(products => {
    if (isEmpty(products)) {
      const newProduct = new Product({code})
      newProduct.save().then(product => {
        res.json({
          done: true,
          detail: product
        })
      })
    } else {
      res.json({
        done: false,
        detail: 'Product already exist'
      })
    }
  })
})

app.get('/remove/product/:id', (req, res) => {
  const code = req.params.id
  try {
    Product.find({code}).then(products => {
      if (!isEmpty(products)) {
        Product.deleteMany({code}).then((result) => {
          res.json({
            done: result.deletedCount > 0,
            detail: result
          })
        })
      } else {
        res.json({
          done: false,
          detail: 'Product is not exist'
        })
      }
    })
  } catch (err) {
    console.log(err, '/remove/product/:id')
    res.json({
      done: false,
      detail: err
    })
  }
})

module.exports = app