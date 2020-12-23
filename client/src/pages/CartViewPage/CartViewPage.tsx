import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './CartViewPage.module.css';
import emptyCartImg from '../../images/emptycart.svg'
import {Book} from '../../interfaces/BookInterface';
import StarDisplay from '../../components/StarDisplay/StarDisplay';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import RippleButton from '../../components/RippleButton/RippleButton';

const CartViewPage = () => {
  const history = useHistory();
  const {user, setUser} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartId, setCartId] = useState<string>("");
  const [cart, setCart] = useState<Array<Book>>([]);
  const [cartTotalCost, setCartTotalCost] = useState<number>(0);

  useEffect(() => {
    if(user == null){
      //history.replace({pathname: "/login"});
    }else{
      setCartId(user.user.cart);
    }
  }, [user])

  useEffect(() => {
    
    console.log(`cartId: ${cartId}`)
    if(cartId !== "" && cartId !== "0"){
      setIsLoading(true);
      // fetch cart with book Items from api
      axios.get("/api/getCart", {
        params: {cartId: cartId}
      }).then((res) => {
        console.log(res.data);
        setCart(res.data);
        setIsLoading(false)
      }).catch((err) => {
        alert("Server Error!")
        setIsLoading(false)
      })
    }else{
      setIsLoading(false);
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
          {(cart && !isLoading && cart.length === 0) && <div className={styles.cartEmptyContainer}>
            <img className={styles.cartEmptyImg} src={emptyCartImg} alt=""/>
          </div>}
          
          <div className={styles.cartListContainer}>
            {
              (isLoading) ? <div className={styles.loaderDiv}><Loader size={50} border={8} color={"#FC7B03"}/></div> : cart.map((book, index) => {
                return <CartBookCard key={index} book={book} />
              })
            }
          </div>
        </div>
        {(cart && cart.length > 0) && <div className={styles.payDetailsPane}>
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
            <RippleButton onClick={() => {
              history.push({pathname:'/checkout', state:{cart : cart, cartId: cartId}});
            }}>Checkout</RippleButton>
          </div>
        </div>}
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
          (book.subtitle !== "") &&<span className={styles.bookSubtitle}>({book.subtitle})</span>
        }
        <span className={styles.bookAuthor}>{book.author}</span>
        <StarDisplay value={parseFloat(`${book.ratings}`)} size={'20px'}/>
        <span className={styles.bookCost}>₹{book.cost}</span>
      </div>
    </div>
  );
}

export default CartViewPage;