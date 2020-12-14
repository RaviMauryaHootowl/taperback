import React from 'react';
import footerLogo from '../../images/footerLogo.svg';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footerBarContainer}>
      <div className={styles.blackBar}></div>
      <div className={styles.accentBar}>
        <img className={styles.footerLogoImage} src={footerLogo} alt=""/>
      </div>
    </div>
  );
}

export default Footer;
