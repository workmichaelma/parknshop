const express = require('express');
const Crawler = require("crawler");
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
      
      res.json({
        'title': $("title").text(),
        'price': $("#item-photo-container .price-container span[itemprop=price]").attr('content')
      })
      done();
    }
  });
  
  c.queue(`https://www.parknshop.com/zh-hk/code/p/${id}`);

})

const port = 8082;

app.listen(port, () => console.log('Server running...'));