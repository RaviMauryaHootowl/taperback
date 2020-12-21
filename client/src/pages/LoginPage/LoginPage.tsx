import React, {useState, useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './LoginPage.module.css';
import logo from '../../images/logo.svg'
import gLogo from '../../images/googlelogo.png'
import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import {UserContext} from '../../contexts/UserContext';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';


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
  const [isLoading , setIsLoading] = useState<boolean>(false);

  const onSuccessCallback = (response : GoogleLoginResponse | GoogleLoginResponseOffline) =>{
    console.log("Logged In");
    //alert(JSON.stringify(response))
    setIsLoading(true);
    const userProfileObj = (response as GoogleLoginResponse).profileObj;
    axios.post("/api/userLogin", {user : (response as GoogleLoginResponse).profileObj}).then(res => {
      setUser({user: res.data, tokenId: (response as GoogleLoginResponse).tokenId, imageUrl: userProfileObj.imageUrl})
      localStorage.setItem("gAuth", JSON.stringify({user: res.data, tokenId: (response as GoogleLoginResponse).tokenId, imageUrl: userProfileObj.imageUrl}));
      setIsLoading(false);
    }).catch((err) => {
      alert("There was an error!")
      setIsLoading(false);
    });
    

  }

  const onFailureCallback = (error: any) => {
    // alert("Try");
  }

  return (
    <div className={styles.loginPageCard}>
        <img className={styles.logo} src={logo} alt=""/>
        <span className={styles.subQuote}>Today a reader,<br/>tomorrow a leader.</span>

        {(isLoading) ? <div className={styles.loaderDiv}><Loader size={50} border={7} color={"#FC7B03"}/></div> :<GoogleLogin 
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
          onFailure={onFailureCallback}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
          />}

    </div>
  );
}

export default LoginPage