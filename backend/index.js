import Koa from 'koa'
import Router from 'koa-router'
// import mount from 'koa-mount';
import { graphqlHTTP } from 'koa-graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { map } from 'lodash'
import moment from 'moment'
import { CronJob } from 'cron'

import { startCron } from './cronjob'
import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'

const isDev = process.env.isDev
const app = new Koa()
const router = new Router()

router.get('/cron', async (ctx) => {
  const { id } = ctx.request.query
  const data = await startCron(id)
  ctx.body = data
})

if (!isDev) {
  // console.log('CRONJOB RUNNING')
  // const _ids = [
  //   '310000',
  //   '300000',
  //   '030000',
  //   '040000',
  //   '320000',
  //   '020000',
  //   '070000',
  //   '060000',
  //   '050000',
  //   '010000',
  //   '080000',
  //   '090000',
  //   '210000',
  //   '200000',
  //   '190000',
  // ]
  const ids = ['080000', '090000']

  map(ids, (id) => {
    const job = new CronJob('0 0 0 */1 * *', () => {
      console.log(`CRONJOB RUNNING - PRODUCT ${id} - ` + moment().format())
      startCron(id)
    })

    job.start()
  })
}

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
})
router.all(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
)
app.use(router.routes()).use(router.allowedMethods())

const PORT = 3000

app.listen(PORT, () =>
  console.log(`BACKEND is running at ${PORT} ${process.env.isDev}`)
)
