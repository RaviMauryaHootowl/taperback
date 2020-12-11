import React, {useState, useEffect} from 'react';
import BookDetails from '../../components/BookDetails/BookDetails';
import axios from 'axios';
import {Book} from '../../interfaces/BookInterface'
import styles from './BookViewPage.module.css';

const BookViewPage:React.FC<{match : any}> = ({match}) => {

  const {
    params: {bookId},
  } = match;

  const [bookDetails, setBookDetails] = useState<Book|null>(null);

  const fetchBookDetails = () => {
    axios.get('/api/findBook', {
      params: {
        bookId: bookId
      }
      })
      .then(function (response) {
        console.log(response.data);
        setBookDetails(response.data);
      })
      .catch(function (error) {
        alert("Server down!")
      });
  }

  useEffect(() => {
    fetchBookDetails();
  }, [match])

  return (
    <div className={styles.booksViewPageContainer}>
      {
        (bookDetails != null) ? <BookDetails bookDetails={bookDetails} /> : <div></div>
      }
    </div>
  );
}


export default BookViewPage;
