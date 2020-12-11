import React, {useState, useContext} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../images/logo.svg';
import searchIcon from '../../images/searchicon.svg';
import cartIcon from '../../images/carticon.svg';
import accountIcon from '../../images/sampleaccountimage.png';
import userSample from '../../images/user.svg';
import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout, useGoogleLogin, useGoogleLogout} from 'react-google-login';
import { UserContext } from '../../contexts/UserContext';
import Menu from '../Menu/Menu';


const Navbar = () => {
  const location = useLocation();
  const history = useHistory();
  const [searchInput, setSearchInput] = useState<string>("");
  const {user, setUser} = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // const CLIENT_ID = "433430673302-s8jmm5nfunii54v95luruc5o80b9dkpq.apps.googleusercontent.com";
  // const CLIENT_SECRET = "2U_F2VCBriA12Aa9p-ogeEvl";

  const onSuccessCallback = (res : GoogleLoginResponse | GoogleLoginResponseOffline) =>{
    console.log("Logged In");
    if(res.code === undefined){
      console.log((res as GoogleLoginResponse).profileObj);
      setUser({user : (res as GoogleLoginResponse).profileObj})
    }
  }

  const CLIENT_ID:string = process.env.REACT_APP_CLIENT_ID || "";
  const CLIENT_SECRET:string = process.env.REACT_APP_CLIENT_SECRET || "";

  const {signIn} = useGoogleLogin({
    clientId: CLIENT_ID,
    onSuccess: onSuccessCallback,
  });

  const {signOut, loaded} = useGoogleLogout({
    clientId : CLIENT_ID,
    onLogoutSuccess: () => {
      onLogOutSuccess();
    }
  })

  const onSearch = () => {
    history.push({pathname:'/search', search: `query=${searchInput}`,});
  }

  const onClickLogo = () => {
    setSearchInput("");
    history.push({pathname:'/'});
  }

  

  const onFailure = (res : any) => {
    console.log("Failed Login");
    console.log(res);
  }

  const logOutUser = () => {
    signOut();
    return true;
  }

  const onLogOutSuccess = () => {
    setUser(null);
    (isMenuOpen) && toggleMenu();
  }

  const toggleMenu = () => {
    (isMenuOpen) ? setIsMenuOpen(false) : setIsMenuOpen(true);  
  }

  const navigateToGenrePage = (genrePath : String) => {
    history.push({pathname:`/genre/${genrePath}`});
  }

  return (
    (location.pathname !== "/login") ? <div className={styles.navOuterContainer}>
      <div className={styles.navInnerContainer}>
        <div className={styles.navTopSection}>
          <img onClick={onClickLogo} className={styles.logoImage} src={logo} alt="Taperback"/>
          <div className={styles.searchBarContainer}>
            <div className={styles.searchBar}>
              <input className={styles.searchBarInput} value={searchInput} onChange={(e) => {setSearchInput(e.target.value)}} onKeyDown={(e) => {if(e.key === "Enter"){onSearch()}}} type="text" placeholder="Search for books, authors, etc..."/>
              <button onClick={onSearch} className={styles.searchBtn}>
                <img src={searchIcon} className={styles.searchBtnIcon} alt="Search"/>
                
              </button>
            </div>
          </div>
          
          <div className={styles.cartContainer}>
            <img className={styles.cartIcon} src={cartIcon} alt=""/>
          </div>
          <div className={styles.accountContainer}>
            {
              (user == null) ? <div>
                <img onClick={() => {history.push("/login")}} className={styles.accountIcon} src={userSample} alt=""/>

              </div> : (
                <div>
                  <img onClick={toggleMenu} className={styles.accountIcon} src={`${user.user.imageUrl}`} alt=""/>
                  {/* <GoogleLogout clientId={CLIENT_ID} buttonText="Logout" onLogoutSuccess={onLogSuccess}></GoogleLogout> */}
                  <Menu menuData={[{name: "Account", action: ()=> {return true;}},{name: "View Orders", action: ()=> {return true;}},{name: "Logout", action: logOutUser}]} isMOpen={isMenuOpen} />
                </div>
              )
            }
          </div>
        </div>
        <div className={styles.navBottomSection}>
          <div className={styles.genreLinkContainer} onClick={() => {navigateToGenrePage("fantasy&fiction");}}>
            <span className={styles.genreLinks}>Fiction</span>
          </div>
          <div className={styles.genreLinkContainer}>
            <span className={styles.genreLinks}>Children's</span>
          </div>
          <div className={styles.genreLinkContainer}>
            <span className={styles.genreLinks}>History</span>
          </div>
          <div className={styles.genreLinkContainer}>
            <span className={styles.genreLinks}>Horror</span>
          </div>
          <div className={styles.genreLinkContainer}>
            <span className={styles.genreLinks}>Mystery</span>
          </div>
          <div className={styles.genreLinkContainer}>
            <span className={styles.genreLinks}>View All</span>
          </div>
        </div>
      </div>
    </div> : <div></div>
  );
}

export default Navbar;


// <GoogleLogin 
//               clientId={CLIENT_ID}
//               buttonText={"Login"}
//               onSuccess={onSuccess}
//               onFailure={onFailure}
//               cookiePolicy={'single_host_origin'}
//               isSignedIn={true}
//               />