import ApolloClient from 'apollo-boost';

const uri = (process.env.VUE_ENV === 'server') ? 'http://api:3000/graphql' : 'http://127.0.0.1:1003/graphql'

const client = new ApolloClient({
  uri
});

export default client