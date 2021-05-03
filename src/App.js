import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Home from './components/pages/home';
import Login from './components/pages/login';
import Register from './components/pages/register';
import SinglePost from './components/pages/singlePost';
import { Container } from 'semantic-ui-react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import Navbar from './components/navbar';
import { AuthProvider } from './components/context/auth';
import AuthRoute from './util/AuthRoute';
import { setContext } from "@apollo/client/link/context";


const httpLink = createHttpLink({
  uri: 'https://ancient-plateau-85388.herokuapp.com/'
});


const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});


function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Container>
            <Navbar />
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <Route exact path="/post/:id" component={SinglePost} />
          </Container>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
