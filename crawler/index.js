const express = require('express');
const Crawler = require("crawler");
const map = require('lodash.map')
const app = express();

const Product = require('./Product')

app.get('/:id/:detail?', (req, res) => {
  var id = req.params.id
  var detail = req.params.detail || false
  
  // res.json(
  //   {
  //     "code": "104639",
  //     "title": "麥維他  牛奶朱古力消化餅獨立包裝 200G",
  //     "image": "https://www.parknshop.com/medias/sys_master/front/prd/8990401789982.jpg",
  //     "categories": [
  //       {
  //         "title": "其他甜味餅乾",
  //         "code": "030109",
  //         "type": "category",
  //       }
  //     ],
  //     "prices": [
  //       {
  //       "amount": 1,
  //       "value": "13.90"
  //       },
  //       {
  //         "amount": 2,
  //         "value": "25.00"
  //       }
  //     ],
  //   }
  // )
  // return 

  try {
    var c = new Crawler({
      maxConnections: 10,
      // This will be called for each crawled page
      callback: function (error, doc, done) {
        console.log(`Getting Product: ${id}, ${doc.statusCode}`)
        if (error || doc.statusCode !== 200) {
          console.log(error || doc.statusCode);
          res.json({error: true})
        } else {
          var $ = doc.$;
          res.json(Product.init($, id, detail))
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