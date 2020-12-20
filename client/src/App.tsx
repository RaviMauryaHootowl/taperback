import React, {useState, useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import SearchPage from './pages/SearchPage/SearchPage';
import BookViewPage from './pages/BookViewPage/BookViewPage';
import OrderCompletePage from './pages/OrderCompletePage/OrderCompletePage';
import { UserContext } from './contexts/UserContext';
import LoginPage from './pages/LoginPage/LoginPage';
import GenreBooksPage from './pages/GenreBooksPage/GenreBooksPage';
import CartViewPage from './pages/CartViewPage/CartViewPage';
import BuyPage from './pages/BuyPage/BuyPage';
import axios from 'axios';


const App:React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStored = localStorage.getItem("gAuth");
    if(userStored !== null){
      const storedUserObject = JSON.parse(userStored);
      refreshUser(storedUserObject);
    }
  }, [])

  const refreshUser = (userObject) => {
    axios.post("/api/userLoginFast", {userGoogleId : userObject.user.googleId}).then(res => {
      console.log(res.data);
      setUser({user: res.data, tokenId: userObject.tokenId, imageUrl: userObject.imageUrl})
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <Router>
      <UserContext.Provider value={{user, setUser}}>
        <div>
          <Navbar/>
        </div>
        <Route path="/" exact component={Home}/>
        <Route path="/login" exact component={LoginPage}/>
        <Route path="/search" component={SearchPage}/>
        <Route path="/cart" exact component={CartViewPage}/>
        <Route path="/checkout" exact component={BuyPage}/>
        <Route path="/ordercomplete" exact component={OrderCompletePage}/>
        <Route path="/book/:bookId" component={BookViewPage}/>
        <Route path="/genre/:genreName" component={GenreBooksPage}/>
      </UserContext.Provider>
      
    </Router>
  );
}

export default App;
