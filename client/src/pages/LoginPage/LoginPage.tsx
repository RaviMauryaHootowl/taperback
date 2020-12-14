import React, {useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './LoginPage.module.css';
import logo from '../../images/logo.svg'
import gLogo from '../../images/googlelogo.png'
import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import {UserContext} from '../../contexts/UserContext';
import axios from 'axios';


const LoginPage:React.FC = () => {

  const history = useHistory();
  const {user, setUser} = useContext(UserContext);
  useEffect(() => {
    if(user != null){
      history.replace("/")
    } 
  }, [user])

  return(
    <div className={styles.loginPageContainer}>
      <LoginCard />
    </div>
  );
}

const LoginCard = () => {

  const {user, setUser} = useContext(UserContext);
  const CLIENT_ID:string = process.env.REACT_APP_CLIENT_ID || "";


  const onSuccessCallback = (response : GoogleLoginResponse | GoogleLoginResponseOffline) =>{
    console.log("Logged In");
    if(response.code === undefined){
      const userProfileObj = (response as GoogleLoginResponse).profileObj;
      
      axios.post("/api/userLogin", {user : (response as GoogleLoginResponse).profileObj}).then(res => {
        console.log(res.data);
        setUser({user: res.data, tokenId: (response as GoogleLoginResponse).tokenId, imageUrl: userProfileObj.imageUrl})
      }).catch((err) => {
        console.log(err);
      });
    }

  }

  return (
    <div className={styles.loginPageCard}>
        <img className={styles.logo} src={logo} alt=""/>
        <span className={styles.subQuote}>Today a reader,<br/>tomorrow a leader.</span>

        <GoogleLogin 
          clientId={CLIENT_ID}
          render={
            (props) => {
              return (
                <button className={styles.googleLoginBtnBtn} onClick={props.onClick} disabled={props.disabled}>
                  <div className={styles.googleLoginBtn}>
                    <img className={styles.googleLogoImage} src={gLogo} alt=""/>
                    <span>Sign in with Google</span>
                  </div>
                </button>
              )
            }
          }
          buttonText={"Login"}
          onSuccess={onSuccessCallback}
          onFailure={onSuccessCallback}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
          />

    </div>
  );
}

export default LoginPage