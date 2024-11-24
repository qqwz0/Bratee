import React from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

import meditationsCover from '../../Assets/meditations_cover.jpg';
import mythCover from '../../Assets/the_myth_cover.jpg';
import percyCover from '../../Assets/percy_jackson_cover.jpg';
import historyCover from '../../Assets/secret_history_image.jpg';
import atomicCover from '../../Assets/atomic_habits_image.jpg';

const About = () => {
  // Початкові захардкожені книги
  const initialBooks = [
    { title: 'Медитації', author: 'Маркус Аврелій', image: meditationsCover },
    { title: 'Міф про Сізіфа', author: 'Альбер Камю', image: mythCover },
    { title: 'Персі Джексон', author: 'Рік Ріордан', image: percyCover },
    { title: 'Тайна історія', author: 'Донна Тартт', image: historyCover },
    { title: 'Атомні звички', author: 'Джеймс Клір', image: atomicCover },
  ];

  const [books] = useState(initialBooks); // Зберігаємо книги тут

  // Адаптивні налаштування для каруселі
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 800 },
      items: 5,
    },
  };

  return (
    <div className="search-books-container">
      <h1 className="primary-heading" id="about-heading">Шукайте свої улюблені книги</h1>
      <p className="primary-text" id='about-text'>
        Тут ви знайдете широкий вибір книг для вивчення.<br />
        Від бестселерів до прихованих перлин, переглядайте різні жанри та відкривайте для себе наступну чудову книгу.
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
          Шукати! <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
};

export default About;
