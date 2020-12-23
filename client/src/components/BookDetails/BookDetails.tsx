import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './BookDetails.module.css';
import {Book} from '../../interfaces/BookInterface'
import StarDisplay from '../StarDisplay/StarDisplay';
import {UserContext} from '../../contexts/UserContext';
import axios from 'axios';

const BookDetails:React.FC<{bookDetails : Book}> = ({bookDetails}) => {
  const {user, setUser} = useContext(UserContext);
  const history = useHistory();
  const updatedUser = user;

  const addToCartClick = () => {
    if(user != null){
      const userGoogleId = user.user.googleId;
      const tokenId = user.tokenId;
      console.log(bookDetails);
      axios.post("/api/addToCart", {tokenId, bookId: bookDetails._id, userGoogleId}).then(res => {
        if(res.data.message === "Invalid Token"){
          alert("Error. Logout and Login again.")
        }else{
          console.log(res.data);
          updatedUser.user.cartItems = res.data.cart;
          updatedUser.user.cart = res.data.cart._id;
          setUser({...updatedUser});
        }
        
      })
    }else{
      history.push("/login");
    }
  }

  const buyNowBtn = () => {
    const userGoogleId = user.user.googleId;
    const tokenId = user.tokenId;

    axios.post("/api/createCartForBuy", {tokenId, bookId: bookDetails._id, userGoogleId}).then(res => {
      console.log(res.data);
      const {message, cart, cartId} = res.data;
      
      if(message === "cart created"){
        // refresh your user
        history.push({pathname:'/checkout', state:{cart : cart, cartId: cartId}});
      }else{
        alert("There was some problem.")
      }
    })
  }

  return (
    <div className={styles.bookDetailsPageContainer}>
      <div className={styles.bookCoverContainer}>
        <img className={styles.bookCoverImage} src={`${bookDetails.cover}`} alt={`${bookDetails.title}`}/>
      </div>
      <div className={styles.bookDetailsContainer}>
        <span className={styles.bookTitle}>{bookDetails.title}</span>
        {(bookDetails.subtitle !== "") && <span className={styles.bookSubtitle}>({bookDetails.subtitle})</span>}
        <span className={styles.bookAuthor}>by {bookDetails.author}</span>
        <div className={styles.starRatingsContainerWithVal}>
          <StarDisplay value={parseFloat(`${bookDetails.ratings}`)} size={'20px'}/>
          <span className={styles.ratingVal}>{bookDetails.ratings}</span>
        </div>
        <span className={styles.bookCost}>₹{bookDetails.cost}/-</span>
        <div className={styles.buyBtnContainer}>
          <button className={styles.buyBtn} onClick={buyNowBtn}>Buy Now</button>
          <button className={styles.addToCartBtn} onClick={addToCartClick}>Add to Cart</button>
        </div>
        <span className={styles.bookDesc}>{bookDetails.desc}</span>
      </div>
    </div>
  );
}



export default BookDetails;