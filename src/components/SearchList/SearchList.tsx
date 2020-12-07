import React, {useState} from 'react';
import BookSection from '../HomeBookSection/BookSection';
import styles from './SearchList.module.css';

const SearchList: React.FC<{bookData : Array<Book>}> = ({bookData}) => {


  return (
    <div className={styles.bookListContainer}>
      <div className={styles.searchHeader}>
        <span>Search Results</span>
        <div className={styles.orangeLine}></div>
      </div>
      {
        bookData.map((book, index) => {
          return (
            <SearchBookCard book={book} key={index}/>
          );
        })
      }
    </div>
  );
}

const SearchBookCard: React.FC<{book: Book}> = ({book}) => {
  return (
    <div className={styles.searchBookCard}>
      <img className={styles.bookCoverImage} src={`${book.cover}`} alt={`${book.title}`}/>
      <div className={styles.bookInfoContainer}>
        <span className={styles.bookTitle}>{book.title}</span>
        <span className={styles.bookAuthor}>{book.author}</span>
        <span className={styles.bookCost}>₹{book.cost}</span>
      </div>
    </div>
  );
}

interface Book {
  _id: any,
  title: String,
  author: String,
  desc: String,
  cover: String,
  cost: Number
}

export default SearchList;