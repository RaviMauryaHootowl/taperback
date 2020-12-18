import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import styles from './GenreBooksPage.module.css';
import fantasyImg from '../../images/fantasyHeader.png'
import childrensImg from '../../images/childrensHeader.png'
import {Book} from '../../interfaces/BookInterface'
import {GenreGetInterface} from '../../interfaces/GenreGetInterface'
import Loader from '../../components/Loader/Loader';

const genreMap:any = {
  "fantasy&fiction" : {
    "name" : "Fantasy & Fiction",
    "image": fantasyImg,
    "textColor": "#000000",
    "shadowColor": "#ffffff"
  },
  "childrens" : {
    "name" : "Children's",
    "image": childrensImg,
    "textColor": "#ffffff",
    "shadowColor": "#000000"
  }
}

const GenreBooksPage:React.FC<{match : any}> = ({match}) => {

  const [genreData, setGenreData] = useState<GenreGetInterface>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [genreName, setGenreName] = useState<string>(match.params.genreName);

  useEffect(() => {
    setGenreName(match.params.genreName);
  }, [match])

  const fetchGenre = () => {
    setIsLoading(true);
    axios.get('/api/genre', {
      params: {
        genrePath: genreName
      }
      })
      .then(function (response) {
        console.log(response.data);
        setGenreData(response.data);
        setIsLoading(false);
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
        <div className={styles.headerForGenre} style={{ backgroundImage: `url(${genreMap[genreName].image})` }}>
          <span className={styles.genreName} style={{color: `${genreMap[genreName].textColor}`, textShadow: `${genreMap[genreName].shadowColor} 2px 2px 10px`}}>{genreMap[genreName].name}</span>
        </div>

        {(isLoading) ? <div className={styles.loaderDiv}><Loader size={50} border={8} color={"#FC7B03"}/></div> : <div className={styles.booksListContainer}>
          {
            genreData?.genreBooks.map((book, index) => {
              return <BookCard book={book}/>
            })
          }
        </div>}

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