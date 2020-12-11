import React, {useState} from 'react';
import styles from './Menu.module.css';
import {MenuInterface} from '../../interfaces/MenuInterface';

const Menu : React.FC<{menuData : MenuInterface, isMOpen : boolean}> = ({menuData, isMOpen}) => {
  
  console.log(isMOpen);

  return (
    <div style={{display: isMOpen ? 'block' : 'none' }} className={styles.dropDownMenuContainer}>
      {
        menuData.map((menu, index) => {
          return <div key={index} onClick={menu.action} className={styles.dropDownMenuItem}>{menu.name}</div>
        })
      }
    </div>
  );
}

export default Menu;