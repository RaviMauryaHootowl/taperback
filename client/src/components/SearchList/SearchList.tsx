import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import StarDisplay from '../StarDisplay/StarDisplay';
import styles from './SearchList.module.css';
import {Book} from '../../interfaces/BookInterface'
import Loader from '../Loader/Loader';
import emptySearch from '../../images/emptySearch.svg';

const SearchList: React.FC<{bookData : Array<Book>, isLoading: boolean}> = ({bookData, isLoading}) => {


  return (
    <div className={styles.bookListContainer}>
      <div className={styles.searchHeader}>
        <span>Search Results</span>
        <div className={styles.orangeLine}></div>
      </div>
      {
        (isLoading)? <div className={styles.loaderDiv}><Loader size={50} border={8} color={"#FC7B03"}/></div> : 
        ((bookData && bookData.length === 0) ? <img className={styles.emptySearchImage} src={emptySearch} alt=""/> : bookData.map((book, index) => {
          return (
            <SearchBookCard book={book} key={index}/>
          );
        }))
      }
    </div>
  );
}

const SearchBookCard: React.FC<{book: Book}> = ({book}) => {

  const history = useHistory();

  const onBookClick = () => {
    history.push({pathname:`/book/${book._id}`});
  }

  return (
    <div className={styles.searchBookCard}>
      <img className={styles.bookCoverImage} onClick={onBookClick} src={`${book.cover}`} alt={`${book.title}`}/>
      <div className={styles.bookInfoContainer}>
        <span className={styles.bookTitle} onClick={onBookClick}>{book.title}</span>
        {(book.subtitle !== "") && <span className={styles.bookSubtitle}>({book.subtitle})</span>}
        <span className={styles.bookAuthor}>{book.author}</span>
        <StarDisplay value={parseFloat(`${book.ratings}`)} size={'20px'}/>
        <span className={styles.bookCost}>₹{book.cost}</span>
      </div>
    </div>
  );
}


export default SearchList;