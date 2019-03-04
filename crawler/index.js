const express = require('express');
const Crawler = require("crawler");
const map = require('lodash.map')
const app = express();

const Product = require('./Product')

app.get('/:id/:detail?', (req, res) => {
  var id = req.params.id
  var detail = req.params.detail || false
  
  try {
    var c = new Crawler({
      maxConnections: 10,
      // This will be called for each crawled page
      callback: function (error, doc, done) {
        if (error) {
          console.log(error);
        } else {
          var $ = doc.$;
          res.json(Product.init($, detail))
          // $ is Cheerio by default
          //a lean implementation of core jQuery designed specifically for the server
        }
        done();
      }
    });
    
    c.queue(`https://www.parknshop.com/zh-hk/code/p/${id}`);
  } catch (err) {
    res.json({})
  }

})

const port = 8082;

app.listen(port, () => console.log('Server running...'));