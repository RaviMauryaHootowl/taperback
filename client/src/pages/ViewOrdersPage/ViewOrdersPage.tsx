import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './ViewOrdersPage.module.css';
import {Book} from '../../interfaces/BookInterface';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';

const ViewOrdersPage = ({location}) => {
  const history = useHistory();
  const {user, setUser} = useContext(UserContext);
  const [ordersList, setOrdersList] = useState<Array<any>>([]);

  useEffect(() => {
    // if(user == null){
    //   history.replace({pathname: "/login"});
    // }else{
    //   fetchOrders();
    // }
    if(user !== null){
      fetchOrders();
    }
  }, [user])

  const fetchOrders = () => {
    axios.get("/api/getOrders", {
      params: {
        userGoogleId: user.user.googleId
      }
    }).then((res) => {
      console.log(res.data);
      setOrdersList(res.data.orders);
    }).catch((err) => {
      alert("Server Error!")
    })
  }

  const getOrderStatus = (orderStatusNumber) => {
    switch (orderStatusNumber) {
      case 0:
        return "In Cart"
      case 1:
        return "Ordered"
      case 2: 
        return "Shipped"
      case 3:
        return "Delivered"
    }
  }

  // useEffect(() => {
  //   let totalCost = 0;
  //   for(let i = 0; i < cart.length; i++){
  //     totalCost += Number(cart[i].cost);
  //   }
  //   setCartTotalCost(totalCost);
  // }, [])

  return (
    <div className={styles.cartViewPageOuterContainer}>
      <div className={styles.cartViewPageContainer}>
        <div className={styles.cartListPane}>
          <div className={styles.cartHeader}>
            <span>Your Orders</span>
            <div className={styles.orangeLine}></div>
          </div>
          
          {ordersList.map((order, index) => {
            return <div className={styles.orderDetailsContainer}>
              <span className={styles.orderHeader}>Order Details</span>
              <div className={styles.orderDetailsInnerContainer}>
                <span className={styles.orderDetails}>Order Number : {order._id}</span>
                <span className={styles.orderDetails}>Status : {getOrderStatus(order.status)}</span>
              </div>
              <div className={styles.splitLineOrange}></div>
              <table className={styles.totalTable}>
                <tr>
                  <td className={styles.priceLabel}>Total</td>
                  <td className={styles.priceTag}>Rs. {order.cost}</td>
                </tr>
              </table>
            </div>
          })
          }
        </div>   
      </div>
    </div>
  );
}


export default ViewOrdersPage;