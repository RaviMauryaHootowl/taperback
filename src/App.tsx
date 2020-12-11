import React, {useState, useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import SearchPage from './pages/SearchPage/SearchPage';
import BookViewPage from './pages/BookViewPage/BookViewPage';
import { UserContext } from './contexts/UserContext';
import LoginPage from './pages/LoginPage/LoginPage';
import GenreBooksPage from './pages/GenreBooksPage/GenreBooksPage';


const App:React.FC = () => {
  const [user, setUser] = useState<any>(null);


  return (
    <Router>
      <UserContext.Provider value={{user, setUser}}>
        <div>
          <Navbar/>
        </div>
        <Route path="/" exact component={Home}/>
        <Route path="/login" exact component={LoginPage}/>
        <Route path="/search" component={SearchPage}/>
        <Route path="/book/:bookId" component={BookViewPage}/>
        <Route path="/genre/:genreName" component={GenreBooksPage}/>
      </UserContext.Provider>
      
    </Router>
  );
}

export default App;
