import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import styles from './GenreBooksPage.module.css';
import fantasyImg from '../../images/fantasyHeader.png'
import {Book} from '../../interfaces/BookInterface'
import {GenreGetInterface} from '../../interfaces/GenreGetInterface'

const genreMap:any = {
  "fantasy&fiction" : {
    "name" : "Fantasy & Fiction",
    "image": fantasyImg
  }
}

const GenreBooksPage:React.FC<{match : any}> = ({match}) => {

  const [genreData, setGenreData] = useState<GenreGetInterface>();

  const {
    params: {genreName},
  } = match;
  const loc = "../../images/fantasyHeader.png";

  console.log(genreName);

  const fetchGenre = () => {
    axios.get('/api/genre', {
      params: {
        genrePath: genreName
      }
      })
      .then(function (response) {
        console.log(response.data);
        setGenreData(response.data);
        // setBookDetails(response.data);
      })
      .catch(function (error) {
        alert("Server down!")
      });
  }

  useEffect(() => {
    fetchGenre();
  }, [genreName])

  return (
    <div className={styles.genreBookPageOuterContainer}>
      <div className={styles.genreBookPageContainer}>
        <div className={styles.headerForGenre}>
          <span className={styles.genreName}>{genreMap[genreName].name}</span>
        </div>

        <div className={styles.booksListContainer}>
          {
            genreData?.genreBooks.map((book, index) => {
              return <BookCard book={book}/>
            })
          }
        </div>

      </div>
      
      

    </div>
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

export default GenreBooksPage;