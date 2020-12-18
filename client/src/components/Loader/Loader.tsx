import React from 'react';
import styles from './Loader.module.css'

const Loader:React.FC<{size: number, border : number, color: string}> = ({size, border, color}) => {

  const customLoaderStyle = {
    width : `${size}px`,
    height : `${size}px`,
  };

  const customLoaderCirclesStyle = {
    width : `${size}px`,
    height : `${size}px`,
    border: `${border}px solid ${color}`,
    borderColor: `${color} transparent transparent transparent`
  };

  return (
    <div style={customLoaderStyle} className={styles.customLdsRing}>
      <div style={customLoaderCirclesStyle}></div>
      <div style={customLoaderCirclesStyle}></div>
      <div style={customLoaderCirclesStyle}></div>
    </div>
    
  );
}

export default Loader;