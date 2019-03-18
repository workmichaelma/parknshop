import Layout from '../components/MyLayout.js'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

const Index = (props) => (
  <Layout>
    <h1>Batman TV Shows</h1>
    <ul>
      {props.product.map((p) => (
        <li key={p.code}>
          <Link as={`/p/${p.code}`} href={`/post?id=${p.code}`}>
            <a>{p.title}</a>
          </Link>
        </li>
      ))}
    </ul>
    <style jsx>
  h1, a {
    font-family: "Arial";
  }

  ul {
    padding: 0;
  }

  li {
    list-style: none;
    margin: 5px 0;
  }

  a {
    text-decoration: none;
    color: blue;
  }

  a:hover {
    opacity: 0.6;
  }
</style>
  </Layout>
)

Index.getInitialProps = async function() {
  const res = await fetch('http://127.0.0.1:3000/api/list/product')
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)

  return {
    product: data
  }
}

export default Index