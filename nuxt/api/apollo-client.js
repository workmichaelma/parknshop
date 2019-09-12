import ApolloClient from 'apollo-boost';

let uri
if (process.env.VUE_ENV === 'server') {
  uri = 'http://api:3000/graphql'
} else {
  if (process.env.NODE_ENV === 'development') {
    uri = 'http://127.0.0.1:1003/graphql'
  } else {
    uri = 'http://159.65.132.237:1003/graphql'
  }
}

const client = new ApolloClient({
  uri
});

export default client