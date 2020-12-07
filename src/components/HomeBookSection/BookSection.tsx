import React, {useState, useEffect} from 'react';
import styles from './BookSection.module.css';
import bestSellersImage from '../../images/bestsellerscover.png';
import bookImg from '../../images/book1.png';
import axios from 'axios';

interface SectionDataSend {
  sectionName: String,
  sectionCover: String,
  sectionBooks: Array<Book>
}

interface Book {
  title: String,
  author: String,
  desc: String,
  cover: String,
  cost: Number
}

const BookSection = () => {

  const [sectionData, setSectionData] = useState<Array<SectionDataSend>>([]);

  useEffect(() => {
    fetchBookSections();
  }, [])

  const fetchBookSections = async () => {
    axios.get('/api/indexBooks')
      .then(function (response) {
        console.log(response.data);
        setSectionData(response.data);
      })
      .catch(function (error) {
        alert("Server down!")
      });
  }


  return (
    <div className={styles.bookSectionContainer}>
      <div className={styles.titleContainer}>
        <span>2020 Best Sellers</span>
        <div className={styles.orangeLine}></div>
      </div>
      <div className={styles.sectionBookContainer}>
          <img className={styles.coverImage} src={bestSellersImage} alt=""/>
          <div className={styles.booksListContainer}>
            {
              (sectionData.length > 0) ? sectionData[0].sectionBooks.map((book, index) => {
                return (
                  <BookCard book={book} key={index} />
                );
              }) : <div></div>
            }
          </div>
      </div>
    </div>
  );
}

const BookCard:React.FC<{book: Book}> = ({book}) => {
  return (
    <div className={styles.bookCardContainer}>
      <img className={styles.bookImage} src={`${book.cover}`} alt="Book1"/>
      <span className={styles.bookTitle}>{book.title}</span>
      <span className={styles.bookAuthor}>by {book.author}</span>
      <span className={styles.bookCost}>₹{book.cost}</span>
    </div>
  );
}

export default BookSection;
