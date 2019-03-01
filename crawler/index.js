const express = require('express');
const Crawler = require("crawler");
const map = require('lodash.map')
const words = require('lodash/words')
const app = express();

app.get('/:id', (req, res) => {
  var id = req.params.id
  var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, doc, done) {
      if(error){
          console.log(error);
      }else{
          var $ = doc.$;
          // $ is Cheerio by default
          //a lean implementation of core jQuery designed specifically for the server
      }

      let special = $('#item-photo-container .offer-table')
      let specialOffer
      if (special && special.children().length) {
        specialOffer = $(special.children().map((i, child) => {
          child = $(child)
          price = child.find('span.price')
          return ( {
            amount: child.attr('data-value'),
            price: $(price).contents().map((n, p) => {
              return p.type === 'text' ? words($(p).text(), /[_A-Za-z0-9.@-]+$/g).join('') : ''
            }).get().join('')
          })
        })).get()
      }
      
      res.json({
        'title': $("title").text(),
        'price': $("#item-photo-container .price-container span[itemprop=price]").attr('content'),
        'special-offer': special && specialOffer ? specialOffer : undefined,
      })
      done();
    }
  });
  
  c.queue(`https://www.parknshop.com/zh-hk/code/p/${id}`);

})

const port = 8082;

app.listen(port, () => console.log('Server running...'));