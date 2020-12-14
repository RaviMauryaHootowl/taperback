import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './CartViewPage.module.css';
import {Book} from '../../interfaces/BookInterface';
import StarDisplay from '../../components/StarDisplay/StarDisplay';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';

const CartViewPage = () => {
  const history = useHistory();
  const {user, setUser} = useContext(UserContext);
  let cartId:string = "";
  const [cart, setCart] = useState<Array<Book>>([]);
  const [cartTotalCost, setCartTotalCost] = useState<number>(0);

  useEffect(() => {
    if(user == null){
      history.replace({pathname: "/login"});
    }else{
      cartId = user.user.cart;
    }
  }, [])

  useEffect(() => {
    if(cartId !== ""){
      // fetch cart with book Items from api
      axios.get("/api/getCart", {
        params: {cartId: cartId}
      }).then((res) => {
        setCart(res.data);
      }).catch((err) => {
        alert("Server Error!")
      })
    }
  },[cartId])


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
            <span className={styles.pricingHeader}>Pricing Details</span>
            <div className={styles.priceSheetContainer}>
              <table className={styles.priceSheetTable}>
                <tr>
                  <td className={styles.priceLabel}>Books Total</td>
                  <td className={styles.priceTag}>Rs. {cartTotalCost}</td>
                </tr>
                <tr>
                  <td className={styles.priceLabel}>GST Total</td>
                  <td className={styles.priceTag}>Rs. 50</td>
                </tr>
                <tr>
                  <td className={styles.priceLabel}>Delivery Charges</td>
                  <td className={styles.priceTag}>Rs. 60</td>
                </tr>
              </table>
            </div>
            <div className={styles.splitLineOrange}></div>
            <table className={styles.totalTable}>
                <tr>
                  <td className={styles.priceLabel}>Total</td>
                  <td className={styles.priceTag}>Rs. {cartTotalCost + 110}</td>
                </tr>
              </table>
            <button className={styles.checkoutBtn}>Checkout</button>
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

export default CartViewPage;