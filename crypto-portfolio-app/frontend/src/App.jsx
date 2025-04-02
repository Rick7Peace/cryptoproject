import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './routes/home';
import Dashboard from './routes/dashboard';
import Portfolio from './components/Portfolio';
import './styles/app.css';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/portfolio" component={Portfolio} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;