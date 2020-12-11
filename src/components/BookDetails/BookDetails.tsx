import React, {useState, useEffect} from 'react';
import styles from './BookDetails.module.css';
import {Book} from '../../interfaces/BookInterface'
import StarDisplay from '../StarDisplay/StarDisplay';

const BookDetails:React.FC<{bookDetails : Book}> = ({bookDetails}) => {
  return (
    <div className={styles.bookDetailsPageContainer}>
      <div className={styles.bookCoverContainer}>
        <img className={styles.bookCoverImage} src={`${bookDetails.cover}`} alt={`${bookDetails.title}`}/>
      </div>
      <div className={styles.bookDetailsContainer}>
        <span className={styles.bookTitle}>{bookDetails.title}</span>
        {(bookDetails.subtitle !== "") && <span className={styles.bookSubtitle}>({bookDetails.subtitle})</span>}
        <span className={styles.bookAuthor}>by {bookDetails.author}</span>
        <div className={styles.starRatingsContainerWithVal}>
          <StarDisplay value={parseFloat(`${bookDetails.ratings}`)} size={'20px'}/>
          <span className={styles.ratingVal}>{bookDetails.ratings}</span>
        </div>
        <span className={styles.bookCost}>₹{bookDetails.cost}/-</span>
        <div className={styles.buyBtnContainer}>
          <button className={styles.buyBtn}>Buy Now</button>
          <button className={styles.addToCartBtn}>Add to Cart</button>
        </div>
        <span className={styles.bookDesc}>{bookDetails.desc}</span>
      </div>
    </div>
  );
}



export default BookDetails;