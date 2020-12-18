import React from 'react';
import styles from './SlideMenu.module.css';
import hamIcon from '../../images/hamIcon.svg';
import logo from '../../images/logo.svg'

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

const SlideMenu:React.FC<{onClickHam : ()=>void, pathName:string, navigateToGenrePage: (string) => void}> = ({onClickHam, pathName, navigateToGenrePage}) => {
  return (
    <div className={styles.slideMenuOuterContainer}>
      <img src={hamIcon} className={styles.hamBtn} onClick={onClickHam} alt=""/>
      <div className={styles.navLinksContainer}>
        {
          NavLinksList.map((navLink, index) => {
            return <div key={index} className={styles.genreLinkContainer} onClick={() => {navigateToGenrePage(navLink.pathName); onClickHam();}}>
              <span className={(pathName === navLink.pathName) ? styles.genreLinkActive : styles.genreLinks}>{navLink.name}</span>
            </div>
          })
        }
      </div>
      <img className={styles.miniLogo} src={logo} alt="Taperback"/>
    </div>
  );
}

export default SlideMenu;
