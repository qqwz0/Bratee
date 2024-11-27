import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSortAmountAsc, faSortAmountDesc } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import Navbar from "../../Components/Navbar/Navbar"; 
import SearchPicture from '../../Assets/search-photo.png';
import './BookSearchh.css';

const BookSearchh = () => {
  const [listOfBooks, setListOfBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  const [sortDirection, setSortDirection] = useState('asc');
  let navigate = useNavigate();

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL);
    
    axios.get(`${process.env.REACT_APP_API_URL}/books`)
      .then((response) => {
        const sortedBooks = sortBooks(response.data, 'rating', 'asc');
        setListOfBooks(sortedBooks);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  useEffect(() => {
    const sortedBooks = sortBooks(listOfBooks, sortOption, sortDirection);
    setListOfBooks(sortedBooks);
  }, [sortOption, sortDirection]);

  const searchBooks = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/books/search?title=${searchTerm}`)
      .then((response) => {
        const sortedBooks = sortBooks(response.data, sortOption, sortDirection);
        setListOfBooks(sortedBooks);
      })
      .catch((error) => {
        console.error("Error searching for books:", error);
        setListOfBooks([]); // Очистити список, якщо книги не знайдені
      });
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleDirectionChange = (event) => {
    setSortDirection(event.target.value);
  };

  const sortBooks = (books, option, direction) => {
    return [...books].sort((a, b) => {
      let compareValue = 0;
      
      if (option === 'title') {
        compareValue = a.title.localeCompare(b.title);
      } else if (option === 'rating') {
        compareValue = Number(b.rating) - Number(a.rating);
      } else if (option === 'date') {
        compareValue = new Date(b.createdAt) - new Date(a.createdAt);
      }
      
      return direction === 'asc' ? compareValue : -compareValue;
    });
  };

  const tooltipContent = (
    <div className="tooltip-content">
      <h4>Сортувати за</h4>
      <label>
        <input type="radio" name="sort" value="rating" checked={sortOption === 'rating'} onChange={handleSortChange} />
        Рейтингом
      </label>
      <label>
        <input type="radio" name="sort" value="title" checked={sortOption === 'title'} onChange={handleSortChange} />
        Назвою (A-Z)
      </label>
      <label>
        <input type="radio" name="sort" value="date" checked={sortOption === 'date'} onChange={handleSortChange} />
        Датою додавання
      </label>
      <hr />
      <label>
        <input type="radio" name="direction" value="asc" checked={sortDirection === 'asc'} onChange={handleDirectionChange} />
        За зростанням
      </label>
      <label>
        <input type="radio" name="direction" value="desc" checked={sortDirection === 'desc'} onChange={handleDirectionChange} />
        За спаданням
      </label>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="search-book-container">
        <img src={SearchPicture} alt="Search" />
        <div className="search-books">
          <h1 className="primary-heading" style={{ textAlign: 'left' }}>Знайдіть будь-яку додану книгу тут!</h1>
          <div className="contact-form-container" id="search-books-input-container">
            <input 
              type="text" 
              placeholder="Введіть назву книги тут" 
              id="search-books-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="secondary-button" id="search-books-button" onClick={searchBooks}>
              Пошук <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </button>
          </div>
        </div>
      </div>
      
      <div className="book-grid-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{ marginBottom: '10px', fontSize: '40px' }}>Каталог:</h4>
          <Tippy content={tooltipContent} interactive={true} placement="bottom-start" trigger="click" arrow={false} theme="custom">
            <button className="filter-button">
              <FontAwesomeIcon 
                icon={sortDirection === 'asc' ? faSortAmountAsc : faSortAmountDesc} 
                style={{ marginRight: '5px' }}
              />
              {sortOption === 'rating' && 'За рейтингом'}
              {sortOption === 'title' && 'За назвою (A-Z)'}
              {sortOption === 'date' && 'За датою додавання'}
            </button>
          </Tippy>
        </div>

        {listOfBooks.length > 0 ? (
              <div className="book-grid">
                {listOfBooks.map((book, index) => (
      <div
        className="book-card"
        key={index}
        onClick={() => navigate(`/book/${book.id}`)}
      >
        {book.cover && (
          <img
            src={`${process.env.REACT_APP_API_URL}/${book.cover}`}
            alt={book.title}
            className="book-cover"
          />
        )}
        <div className="book-card-text">
          <h3>{book.title}</h3>
        </div>
        <div className="book-card-hover">
          <p className="hover-title">{book.title}</p>
          {book.Author?.full_name && (
            <p className="hover-author"><strong>Автор:</strong> {book.Author.full_name}</p>
          )}
          {book.Genre?.name && (
            <p className="hover-genre"><strong>Жанр:</strong> {book.Genre?.name}</p>
          )}
      </div>
      </div>
    ))}
          </div>
        ) : (
          <div className="no-books-message">
            <p>Книг не знайдено.</p>
          </div>
        )}
    </div>
    </div>
  );
};

export default BookSearchh;
