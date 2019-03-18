const express = require('express')
const next = require('next')
const cors = require('cors')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const axios = require('axios');

app
  .prepare()
  .then(() => {
    const server = express()
    server.use(cors())

    server.get('/p/:id', (req, res) => {
      const actualPage = '/post'
      const queryParams = { id: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('/api/list/product', (req, res) => {
      return axios.get('http://api:3000/cronjob/list/product').then(r => {
        return res.json(r.data)
      })
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })


    server.listen(3000, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })