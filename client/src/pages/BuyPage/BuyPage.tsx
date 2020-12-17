import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './BuyPage.module.css';
import {Book} from '../../interfaces/BookInterface';
import StarDisplay from '../../components/StarDisplay/StarDisplay';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';

const BuyPage = ({location}) => {
  const history = useHistory();
  const {user, setUser} = useContext(UserContext);
  const [address, setAddress] = useState<string>("");
  const [cart, setCart] = useState<Array<Book>>([]);
  const [cartId, setCartId] = useState<string>("");
  const [cartTotalCost, setCartTotalCost] = useState<number>(0);

  useEffect(() => {
    if(location.state == null){
      history.replace({pathname: "/login"});
    }else{
      setCart(location.state.cart);
      console.log("Location CartId : " + location.state.cartId);
      setCartId(location.state.cartId);
    }
    
  }, [location])

  useEffect(() => {
    if(user == null){
      history.replace({pathname: "/login"});
    }
  }, [])


  const confirmPurchaseClick = () => {
    const userGoogleId = user.user.googleId;
    const tokenId = user.tokenId;
    axios.post("/api/orderCart", {tokenId, cartId: cartId, userGoogleId}).then(res => {
      console.log(res.data);
      const {message} = res.data;
      if(message === "ordered"){
        alert("Your Order has been placed.")
        // refresh your user
        refreshUser();
      }
    })
  }

  const refreshUser = () => {
    axios.get("/api/refreshUser", {params: {userGoogleId: user.user.googleId}}).then((res) => {
      const updatedUser = user;
      updatedUser.user = res.data;
      setUser({...updatedUser});
      history.replace("/");
    });
  }


  useEffect(() => {
    let totalCost = 0;
    for(let i = 0; i < cart.length; i++){
      totalCost += Number(cart[i].cost);
    }
    setCartTotalCost(totalCost);
  }, [cart])

  return (
    <div className={styles.cartViewPageOuterContainer}>
      <div className={styles.cartViewPageContainer}>
        <div className={styles.cartListPane}>
          <div className={styles.cartHeader}>
            <span>Your Cart</span>
            <div className={styles.orangeLine}></div>
          </div>
          <div className={styles.cartListContainer}>
            {
              cart.map((book, index) => {
                return <CartBookCard key={index} book={book} />
              })
            }
          </div>
        </div>
        <div className={styles.payDetailsPane}>
          <div className={styles.payDetailsContainer}>
            <span className={styles.pricingHeader}>Shipping Details</span>
            <div className={styles.addressContainer}>
              <textarea value={address} onChange={(e) => {setAddress(e.target.value)}} className={styles.addressTextArea} placeholder={"Enter your Shipping Address"}></textarea>
            </div>
            <div className={styles.splitLineOrange}></div>
            <table className={styles.totalTable}>
                <tr>
                  <td className={styles.priceLabel}>Total</td>
                  <td className={styles.priceTag}>Rs. {cartTotalCost + 110}</td>
                </tr>
              </table>
            <button onClick={confirmPurchaseClick} className={styles.purchaseBtn}>Confirm Purchase</button>
          </div>
        </div>
      </div>
    </div>
  );
}


const CartBookCard: React.FC<{book: Book}> = ({book}) => {

  const history = useHistory();

  const onBookClick = () => {
    history.push({pathname:`/book/${book._id}`});
  }

  return (
    <div className={styles.cartBookCard}>
      <img className={styles.bookCoverImage} onClick={onBookClick} src={`${book.cover}`} alt={`${book.title}`}/>
      <div className={styles.bookInfoContainer}>
        <span className={styles.bookTitle} onClick={onBookClick}>{book.title}</span>
        {
          (book.subtitle != "") &&<span className={styles.bookSubtitle}>({book.subtitle})</span>
        }
        <span className={styles.bookAuthor}>{book.author}</span>
        <StarDisplay value={parseFloat(`${book.ratings}`)} size={'20px'}/>
        <span className={styles.bookCost}>₹{book.cost}</span>
      </div>
    </div>
  );
}

export default BuyPage;