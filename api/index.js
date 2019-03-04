const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var axios = require('axios');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Item');

app.get('/', (req, res) => {
  Item.find()
    .then(items => res.render('index', { items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.get('/crawler/:id', (req, res) => {
  var id = req.params.id
  axios.get(`http://crawler:8082/${id}`).then((response) => {
    res.json(response.data)
  })
})

app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.redirect('/'));
});

app.post('/item/remove', (req, res) => {
  const item = {
    name: req.body.name
  }

  Item.findOneAndRemove(item).then(item => res.redirect('/'));
});

const port = 3000;

app.listen(port, () => console.log('Server running...'));