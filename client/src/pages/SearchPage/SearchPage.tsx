import React, {useState, useEffect} from 'react';
import styles from './SearchPage.module.css';
import {useHistory} from 'react-router-dom';
import queryString from 'querystring';
import axios from 'axios';
import SearchList from '../../components/SearchList/SearchList';

import {Book} from '../../interfaces/BookInterface'

const SearchPage = () => {
  const history = useHistory();
  const [query, setQuery] = useState<string>("");
  const [bookData, setBookData] = useState<Array<Book>>([]);
  const [isLoading ,setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setQuery(`${queryString.parse(history.location.search)["?query"]}`);
  }, [history.location.search]);

  useEffect(() => {
    if(query !== ""){
      fetchSearchResults();
    }
  }, [query])

  const fetchSearchResults = () => {
    axios.get('/api/search', {
      params: {
        query: query
      }
    })
    .then(function (response) {
      setBookData(response.data);
      setIsLoading(false);
    })
    .catch(function (error) {
      alert("Server down!")
      setIsLoading(false);
    });
  }

  return (
    <div className={styles.searchPageContainer}>
      <SearchList bookData={bookData} isLoading={isLoading}/>
    
    </div>
  );
}


export default SearchPage;
