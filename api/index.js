const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cronjob = require('./cronjob/index')
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const graphqlHTTP = require('express-graphql')
const cors = require('cors');

var axios = require('axios');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
// mongoose
//   .connect(
//     'mongodb://mongo:27017/docker-node-mongo',
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

const Item = require('./models/Item');

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next()
 });

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

app.use('/cronjob', cronjob)

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  formatError: err => ({
    message: err.message,
    status: 202
  })
}))

const port = 3000;

app.listen(port, () => console.log('Server running...'));