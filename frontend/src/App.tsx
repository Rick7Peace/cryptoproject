import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './routes/home';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import './styles/app.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/portfolio" component={Portfolio} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
