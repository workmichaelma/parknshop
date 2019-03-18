import Layout from '../components/MyLayout.js'
import fetch from 'isomorphic-unfetch'

import find from 'lodash/find'

const Post = props => (
  <Layout>
    <h1>{props.product.title}</h1>
    {/* <p>{props.show.summary.replace(/<[/]?p>/g, '')}</p> */}
    <img src={props.product.image} />
  </Layout>
)

Post.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(`http://127.0.0.1:3000/api/list/product`)
  const products = await res.json()

  console.log(find(products, { code: id }), id)

  return {
    product: find(products, { code: id })
  }

  // console.log(`Fetched show: ${show.name}`)

  // return { show }
}

export default Post