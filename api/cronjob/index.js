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
mongoose.connect('mongodb://mongo:27017/parknshop',{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const fetchProduct = async (id, detail = false) => {
  const need = detail ? '/true' : ''
  return await axios.get(`http://crawler:8082/${id}${need}`).then(async (response) => {
    return response.data
  })  
}

const getCategoryID = async (c) => {
  return await Category.find(c).then(async record => {
    try {
      if (isEmpty(record)) {
        const newCategory = new Category(c)
        return await newCategory.save().then(async category => {
          return await category._id
        })
      } else {
        return await record[0]._id
      }
    } catch (err) {
      console.log(err, 'getCategoryID')
      return false
    }
  })
}

const setProduct = async (p) => {
  try {
    if (p.title) {
      const categoryGetters = await p.categories.map(async c => {
        return await getCategoryID(c)
      })
      
      const categories = await Promise.all(categoryGetters).then(cate => {
        return cate
      })

      return await Product.findOneAndUpdate({ code: p.code }, {
        $set: {
          title: p.title,
          image: p.image,
        },
        $addToSet: {
          records: {
            // date: new Date().toLocaleDateString(),
            date: new Date().toLocaleString('en-GB', {timeZone: 'Asia/Hong_Kong'}),
            prices: p.prices
          },
          categories
        },
      })
    } else {
      return await Product.findOneAndUpdate({ code: p.code }, {
        $addToSet: {
          records: {
            // date: new Date().toLocaleDateString(),
            date: new Date().toLocaleString('en-GB', {timeZone: 'Asia/Hong_Kong'}),
            prices: p.prices
          },
        },
      })
    }
  } catch (err) {
    console.log(err, 'setProduct')
  }
}

app.get('/product', (req, res) => {
  Product.find().then(products => {
    try {
      const calls = map(products, (p) => {
        return fetchProduct(p.code, !p.title)
      })
      Promise.all(calls).then(async results => {
        results = await results.map(async r => {
          return(r.error) ? {} : await setProduct(r)
        })
        Promise.all(results).then((output) => {
          res.json(output)
        })
      })
    } catch (err) {
      console.log(err, '/product')
      res.json({err})
    }

  }).catch(err => {
    res.status(404).json({ msg: 'No items found' })
  });
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
app.get('/list/product', (req, res) => {
  Product.find({}, '-_id -__v').populate('categories', '-_id -__v -lastMod').then(products => {
    res.json(products)
  }).catch(err => {
    console.log(err)
    res.status(404).json({ msg: 'No Products found' })
  });
})
app.get('/clear/product', (req, res) => {
  Product.deleteMany({}).then(products => {
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