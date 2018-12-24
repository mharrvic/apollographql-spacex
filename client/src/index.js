import React from "react";
import ReactDOM from "react-dom";
import { Query, ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

import Pages from "./pages";
import Login from "./pages/login";
import { resolvers, typeDefs } from "./resolvers";
import injectStyles from "./styles";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    headers: {
      authorization: localStorage.getItem("token")
    }
  }),
  initializers: {
    isLoggedIn: () => !!localStorage.getItem("token"),
    cartItems: () => []
  }
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
    </Query>
  </ApolloProvider>,
  document.getElementById("root")
);
