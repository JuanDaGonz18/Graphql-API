import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://graphql-api-jexq.onrender.com/graphql", 
  cache: new InMemoryCache(),
});

export default client;
