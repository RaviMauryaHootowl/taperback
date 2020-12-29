import React from 'react';
import styles from './PhoneScreen.module.css';
import bgScreen from '../../images/framescreen.svg'


const PhoneScreen = () => {
  return (
    <div style={{ backgroundImage: `src(${bgScreen})` }} className={styles.phoneScreenContainer}>
      <div className={styles.topBox}>
        <span>2020</span>
        <span>Wrapped</span>
      </div>
      <div className={styles.restBox}>
        <span>Top 3 things I’ve achieved in 2020...</span>
        <div>
          <span>Learned Web Dev, Flutter, MERN, etc</span>
          <span>Learned Web Dev, Flutter, MERN, etc</span>
          <span>Learned Web Dev, Flutter, MERN, etc</span>
        </div>
      </div>
      <div className={styles.bottomBox}>
        <span>Create your own on...</span>
        <span>bit.ly/2020WrappedStory</span>
      </div>
    </div>
  );
}
export default PhoneScreen;