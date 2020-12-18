import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './BookSection.module.css';
import bestSellersImage from '../../images/bestsellerscover.png';
import bookImg from '../../images/book1.png';
import axios from 'axios';
import {Book} from '../../interfaces/BookInterface'
import Loader from '../Loader/Loader';


interface SectionDataSend {
  sectionName: String,
  sectionCover: String,
  sectionBooks: Array<Book>
}

const BookSection = () => {

  const [sectionData, setSectionData] = useState<Array<SectionDataSend>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    fetchBookSections();
  }, [])

  const fetchBookSections = async () => {
    axios.get('/api/indexBooks')
      .then(function (response) {
        console.log(response.data);
        setSectionData(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        alert("Server down!asdfasdf")
        setIsLoading(false);
      });
  }


  return (
    <>
    {
      (isLoading) ? <div className={styles.loaderDiv}><Loader size={50} border={8} color={"#FC7B03"}/></div> : sectionData.map((perSectionData, index) => {
        return <div className={styles.bookSectionContainer}>
          <div className={styles.titleContainer}>
            <span>{perSectionData.sectionName}</span>
            <div className={styles.orangeLine}></div>
          </div>
          <div className={styles.sectionBookContainer}>
              <img className={styles.coverImage} src={`${perSectionData.sectionCover}`} alt=""/>
              <div className={styles.booksListContainer}>
                {
                  perSectionData.sectionBooks.map((book, index) => {
                    return (
                      <BookCard book={book} key={index} />
                    );
                  })
                }
              </div>
          </div>
        </div>
      }) 
    }
    </>
    
  );
}

const BookCard:React.FC<{book: Book}> = ({book}) => {

  const history = useHistory();

  const onBookClick = () => {
    history.push({pathname:`/book/${book._id}`});
  }

  return (
    <div className={styles.bookCardContainer}>
      <img className={styles.bookImage} onClick={onBookClick} src={`${book.cover}`} alt="Book1"/>
      <span className={styles.bookTitle} onClick={onBookClick}>{book.title}</span>
      <span className={styles.bookAuthor}>by {book.author}</span>
      <span className={styles.bookCost}>₹{book.cost}</span>
    </div>
  );
}

export default BookSection;
