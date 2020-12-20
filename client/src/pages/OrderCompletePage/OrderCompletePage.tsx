import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './OrderCompletePage.module.css';
import {Book} from '../../interfaces/BookInterface';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';

const OrderCompletePage = ({location}) => {
  const history = useHistory();
  const {user, setUser} = useContext(UserContext);
  const [cart, setCart] = useState<Array<Book>>([]);
  const [cartId, setCartId] = useState<string>("");
  const [cartTotalCost, setCartTotalCost] = useState<number>(0);

  useEffect(() => {
    if(location.state == null){
      history.replace({pathname: "/login"});
    }else{
      setCart(location.state.cart);
      setCartId(location.state.cartId);
    }
    
  }, [location])

  useEffect(() => {
    if(user == null){
      history.replace({pathname: "/login"});
    }
  }, [])


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
            <span>Order Successful</span>
            <div className={styles.orangeLine}></div>
          </div>
          
          <div className={styles.orderDetailsContainer}>
            <span className={styles.orderHeader}>Order Details</span>
            <div className={styles.orderDetailsInnerContainer}>
              <span className={styles.orderDetails}>Order Number : {cartId}</span>
              <span className={styles.orderDetails}>Status : Ordered</span>
            </div>
            <div className={styles.splitLineOrange}></div>
            <table className={styles.totalTable}>
              <tr>
                <td className={styles.priceLabel}>Total</td>
                <td className={styles.priceTag}>Rs. {cartTotalCost + 110}</td>
              </tr>
            </table>
            <button onClick={() => {
                history.replace("/");
              }} className={styles.goBackBtn}>Go to Home</button>
            </div>
          </div>
          
      </div>
    </div>
  );
}


export default OrderCompletePage;