import React, { useState, useContext, useEffect } from 'react';
import { useGoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router';
import RippleButton from '../../components/RippleButton/RippleButton';
import { UserContext } from '../../contexts/UserContext';
import styles from './AccountPage.module.css';


const AccountPage = () => {
  const history = useHistory();
  const [accountUser, setAccountUser] = useState<any|null>(null);
  const {user, setUser} = useContext(UserContext);


  const CLIENT_ID:string = process.env.REACT_APP_CLIENT_ID || "";

  useEffect(() => {
    if(user !== null){
      setAccountUser(user);
    }
  }, [user])

  const {signOut, loaded} = useGoogleLogout({
    clientId : CLIENT_ID,
    onLogoutSuccess: () => {
      onLogOutSuccess();
    }
  })

  const onLogOutSuccess = () => {
    setUser(null);
    localStorage.removeItem("gAuth");
    history.replace("/");
  }

  function createRipple(event) {
    const button = event.currentTarget;
  
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
  
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");
  
    const ripple = button.getElementsByClassName("ripple")[0];
  
    if (ripple) {
      ripple.remove();
    }
  
    button.appendChild(circle);
  }


  useEffect(() => {
    const button = document.getElementsByTagName("button")[0];
    button.addEventListener("click", createRipple);
  }, [])

  return (
    <div className={styles.accountPageContainer}>
      {(accountUser !== null) && <div className={styles.accountPageInnerContainer}>
        <div>
          <img className={styles.userProfileImage} src={accountUser.imageUrl} alt=""/>
        </div>
        <div className={styles.userInfoContainer}>
          <span className={styles.userName}>{accountUser.user.name}</span>
          <span className={styles.userEmail}>{accountUser.user.email}</span>
          {/* <button className={styles.logoutBtn} onClick={() => {}}>Logout</button> */}
          <RippleButton onClick={signOut}>Logout</RippleButton>
        </div>
      </div>}
    </div>
  );
}

export default AccountPage;