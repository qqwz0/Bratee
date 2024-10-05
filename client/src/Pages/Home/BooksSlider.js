import React from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import axios from "axios";
import { useState, useEffect } from "react";


import meditationsCover from '../../Assets/meditations_cover.jpg';
import mythCover from '../../Assets/the_myth_cover.jpg';
import percyCover from '../../Assets/percy_jackson_cover.jpg';
import historyCover from '../../Assets/secret_history_image.jpg';
import atomicCover from '../../Assets/atomic_habits_image.jpg';

const About = () => {
  // Initial hardcoded books
  const initialBooks = [
    { title: 'Meditations', author: 'Marcus Aurelius', image: meditationsCover },
    { title: 'The Myth of Sisyphus', author: 'Albert Camus', image: mythCover },
    { title: 'Percy Jackson', author: 'Rick Riordan', image: percyCover },
    { title: 'The Secret History', author: 'Donna Tartt', image: historyCover },
    { title: 'Atomic Habits', author: 'James Clear', image: atomicCover },
  ];

  const [books, setBooks] = useState(initialBooks); // Store books here

  // Fetch data from API
  useEffect(() => {
    axios.get('') // Replace with your actual API URL
      .then(response => {
        const fetchedBooks = response.data.map(book => ({
          title: book.title,
          author: book.author,
          image: book.cover_image || meditationsCover // Use default image if none provided
        }));
        setBooks(fetchedBooks); // Update the state with fetched books
      })
      .catch(error => {
        console.error("Error fetching books:", error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Responsive settings for the carousel
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 800 },
      items: 5,
    },
  };

  return (
    <div className="search-books-container">
      <h1 className="primary-heading" id="about-heading">Search for your favourite books</h1>
      <p className="primary-text" id='about-text'>
        On our website, you'll find a wide variety of books to explore.<br />
        From bestsellers to hidden gems, browse through different genres and discover your next great read.
      </p>

      <div className="book-carousel-container">
        <Carousel responsive={responsive} infinite={true} className="carousel">
          {books.map((book, index) => (
            <div className="book-card" key={index}>
              <img src={book.image} alt={book.title} />
              <div className="book-card-text">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
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
  );
};

export default About;