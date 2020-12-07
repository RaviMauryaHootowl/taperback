import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar/Navbar';
import SearchPage from './pages/SearchPage/SearchPage';

function App() {
  return (
    <Router>
      <div>
        <Navbar/>
      </div>
      <Route path="/" exact component={Home}/>
      <Route path="/signup" exact component={SignUp}/>
      <Route path="/search" component={SearchPage}/>
    </Router>
  );
}

export default App;
