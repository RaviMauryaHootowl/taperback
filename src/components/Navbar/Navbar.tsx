import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '../../images/logo.svg';
import searchIcon from '../../images/searchicon.svg';
import cartIcon from '../../images/carticon.svg';
import accountIcon from '../../images/sampleaccountimage.png';


const Navbar = () => {
  const history = useHistory();
  const [searchInput, setSearchInput] = useState<string>("");

  const onSearch = () => {
    history.push({pathname:'/search', search: `query=${searchInput}`,});
  }


  return (
    <div className={styles.navOuterContainer}>
      <div className={styles.navInnerContainer}>
        <div className={styles.navTopSection}>
          <Link to="/"><img className={styles.logoImage} src={logo} alt="Taperback"/></Link>
          <div className={styles.searchBarContainer}>
            <div className={styles.searchBar}>
              <input className={styles.searchBarInput} value={searchInput} onChange={(e) => {setSearchInput(e.target.value)}} type="text" placeholder="Search for books, authors, etc..."/>
              <button onClick={onSearch} className={styles.searchBtn}>
                <img src={searchIcon} className={styles.searchBtnIcon} alt="Search"/>
              </button>
            </div>
          </div>
          <div className={styles.cartContainer}>
            <img className={styles.cartIcon} src={cartIcon} alt=""/>
          </div>
          <div className={styles.accountContainer}>
            <img className={styles.accountIcon} src={accountIcon} alt=""/>
          </div>
        </div>
        <div className={styles.navBottomSection}>
          <div className={styles.genreLinkContainer}>
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
    </div>
  );
}

export default Navbar;
