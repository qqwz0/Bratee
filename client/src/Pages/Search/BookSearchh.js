import React from "react";

//styles
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './BookSearchh.css'
import Navbar from "../../Components/Navbar/Navbar"; 
import SearchPicture from '../../Assets/search-photo.png';

//axios
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BookSearchh = () => {

  const [ listOfBooks, setListOfBooks ] = useState([]);
  let navigate = useNavigate();
  // Fetch data from API
  useEffect(() => {
    axios.get('http://localhost:3001/books') // Replace with your actual API URL
      .then((response) => {
        setListOfBooks(response.data);
      })}, []); // Empty dependency array means this effect runs once when the component mounts

  // Responsive settings for the carousel
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 800 },
      items: 5,
    },
  };

  return (
    <div>
      <Navbar />
      <div className="search-book-container">
        <img src={SearchPicture}/>
        <div className="search-books">
          <h1 class="primary-heading" style={{ textAlign: 'left' }} >Find any added book here!</h1>
          <div className="contact-form-container" id="search-books-input-container">
            <input type="text" placeholder="Enter book title here" id="search-books-input"/>
            <button className="secondary-button" id="search-books-button">Search <FontAwesomeIcon icon={faMagnifyingGlass}/></button>
          </div>
        </div>
      </div>
      <div className="carousel-books-container">
      <h1 classname='primary-heading'>Check out other books!</h1>
        {/* <h1 className="primary-heading" id="about-heading">Search for your favourite books</h1>
        <p className="primary-text" id='about-text'>
          On our website, you'll find a wide variety of books to explore.<br />
          From bestsellers to hidden gems, browse through different genres and discover your next great read.
        </p> */}



        <div className="book-carousel-container">
          <Carousel responsive={responsive} infinite={true} className="carousel">
            {listOfBooks.map((book, index) => (
              <div className="book-card" key={index} onClick={() => {navigate(`/book/${book.id}`)}}>
                {book.cover && (
                  <img 
                    src={`http://localhost:3001/${book.cover}`}
                    alt={book.title}
                    className="book-cover"
                  />
                )}
                <div className="book-card-text">
                  <h3>{book.title}</h3>
                  <p>{book.Author.full_name}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="search-button-container">
          <button className="secondary-button">
            Search! <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookSearchh;