import React, {useState, useContext} from 'react';
import {useHistory, useLocation, Link} from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../images/logo.svg';
import searchIcon from '../../images/searchicon.svg';
import cartIcon from '../../images/carticon.svg';
import userSample from '../../images/user.svg';
import { useGoogleLogout} from 'react-google-login';
import { UserContext } from '../../contexts/UserContext';
import Menu from '../Menu/Menu';


const Navbar = () => {
  const location = useLocation();
  const history = useHistory();
  const [searchInput, setSearchInput] = useState<string>("");
  const {user, setUser} = useContext(UserContext);
  console.log(user);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const NavLinksList = [
    {
      "name" : "Fiction",
      "pathName" : "/genre/fantasy&fiction"
    },
    {
      "name" : "Children's",
      "pathName" : "/genre/childrens"
    },
    {
      "name" : "History",
      "pathName" : "/genre/history"
    },
    {
      "name" : "Horror",
      "pathName" : "/genre/horror"
    },
    {
      "name" : "Mystery",
      "pathName" : "/genre/mystery"
    },
    {
      "name" : "Non-Fiction",
      "pathName" : "/genre/nonfiction"
    }
  ]

  const pathName = location.pathname;

  const CLIENT_ID:string = process.env.REACT_APP_CLIENT_ID || "";
  const CLIENT_SECRET:string = process.env.REACT_APP_CLIENT_SECRET || "";

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
    history.push({pathname:`${genrePath}`});
  }

  return (
    (pathName !== "/login") ? <div className={styles.navOuterContainer}>
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
          
          <Link to="/cart"><div className={styles.cartContainer}>
            <img className={styles.cartIcon} src={cartIcon} alt=""/>
            <span className={styles.cartBadge}>{(user != null && user.user.cartItems) ? user.user.cartItems.items.length : 0}</span>
          </div></Link>
          <div className={styles.accountContainer}>
            {
              (user == null) ? <div>
                <img onClick={() => {history.push("/login")}} className={styles.accountIcon} src={userSample} alt=""/>

              </div> : (
                <div>
                  <img onClick={toggleMenu} className={styles.accountIcon} src={`${user.imageUrl}`} alt=""/>
                  {/* <GoogleLogout clientId={CLIENT_ID} buttonText="Logout" onLogoutSuccess={onLogSuccess}></GoogleLogout> */}
                  <Menu menuData={[{name: "Account", action: ()=> {return true;}},{name: "View Orders", action: ()=> {return true;}},{name: "Logout", action: logOutUser}]} isMOpen={isMenuOpen} />
                </div>
              )
            }
          </div>
        </div>
        <div className={styles.navBottomSection}>
          {
            NavLinksList.map((navLink, index) => {
              return <div key={index} className={styles.genreLinkContainer} onClick={() => {navigateToGenrePage(navLink.pathName);}}>
                <span className={(pathName === navLink.pathName) ? styles.genreLinkActive : styles.genreLinks}>{navLink.name}</span>
              </div>
            })
          }
        </div>
      </div>
    </div> : <div></div>
  );
}

export default Navbar;