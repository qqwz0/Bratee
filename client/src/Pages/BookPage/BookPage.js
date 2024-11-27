import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import BannerBackground from "../../Assets/home-banner-background.png";
import "./BookPage.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewModal from "./ReviewModal"; // Import your modal component

import Tippy from "@tippyjs/react"; // Import Tippy.js
import 'tippy.js/dist/tippy.css'; // Import Tippy.js styles
import { getUserId } from '../../Components/Navbar/Navbar';
 
function BookPage() {
  const { id } = useParams();
  const [bookObject, setBookObject] = useState({});
  const [reviews, setReviews] = useState([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [category, setCategory] = useState(null); // State for selected category
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false); // State to track if the description is expanded
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const bookResponse = await axios.get(`${process.env.REACT_APP_API_URL}/books/byId/${id}`);
        setBookObject(bookResponse.data);
        
        const reviewsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${id}`);
        setReviews(reviewsResponse.data);
  
        const userId = getUserId();
        console.log(userId, id);
        
        if (userId) {
          try {
            const categoriesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/likedbooks/${userId}/${id}`)
            
            // Check for 404 explicitly or handle absence of likedBook
            if (categoriesResponse.status === 404) {
              console.log("Книга не знайдена у збірках користувача");
              setCategory(null);  // Set category to null if not found
            } else if (categoriesResponse.data && categoriesResponse.data.likedBook && categoriesResponse.data.likedBook.category) {
              setCategory(categoriesResponse.data.likedBook.category);  // Access category from likedBook object
            } else {
              console.log("Для цієї книги не знайдено категорій.");
              setCategory(null);  // In case no category is found
            }
          } catch (error) {
            console.error("Помилка відображення книг", error);  // Log error in case of other issues
            setCategory(null);  // Optionally, set category to null in case of error
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookAndReviews();
  }, [id]);

  const handleAddReview = async (newReview) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      alert("Ти мусиш бути зареєстрованим, щоби додавати відгуки.");
      return;
    }
  
    try {
      // Постимо відгук на сервер
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reviews/`, 
        { ...newReview, BookId: id }, 
        { headers: { accessToken } }
      );
  
      // Оновлюємо список відгуків, додаючи новий
      setReviews((prev) => {
        const updatedReviews = [...prev, response.data];
        const updatedAverageRating = calculateAverageRating(updatedReviews); // Перераховуємо середній рейтинг після додавання нового відгуку
        
        // Оновлюємо рейтинг на сервері
        axios.put(`${process.env.REACT_APP_API_URL}/books/rating/${id}`, { rating: updatedAverageRating });
  
        return updatedReviews;
      });
  
    } catch (err) {
      alert("Помилка в додаванні відгуку. Будь ласка, спробуйте ще раз.");
    }
  };
  
  // Calculate the average rating
  // Функція для розрахунку середнього рейтингу
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0; // Якщо відгуків немає, повертаємо 0

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0); // Підсумовуємо всі оцінки
    return (totalRating / reviews.length).toFixed(1); // Повертаємо середнє значення з 1 десятковим знаком
  };

  const handleCategorySelect = async (selectedCategory) => {
    // Get userId from the decoded token
    const userId = getUserId();
  
    // Check if the user is logged in
    if (!userId) {
      alert('Ти мусиш бути зареєстрованим, щоби додавати книги у збірки.');
      return;
    }
  
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('Ти мусиш бути зареєстрованим, щоби додавати книги у збірки.');
      return;
    }
  
    // If the selected category is already the current category, remove it from both the UI and the database
    if (category === selectedCategory) {
      setCategory(null); // Reset the category to null
  
      try {
        // Make a DELETE request to remove the category from the user's liked books
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/likedbooks`,
          {
            headers: { accessToken },
            data: { userId: userId, bookId: id, category: selectedCategory },
          }
        );
  
        if (response.status === 200) {
          alert('Книга прибрана зі збірки!');
        }
      } catch (error) {
        console.error(error);
        alert('Не вийшло прибрати книгу зі збірки :(. Спробуй ще раз.');
      }
  
      return; // Exit the function early since the category was removed
    }
  
    // Set the category and add it to the database only if the user is logged in
    setCategory(selectedCategory);
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/likedbooks`,
        { userId: userId, bookId: id, category: selectedCategory },
        { headers: { accessToken } }
      );
  
      if (response.status === 201) {
        alert('Книга успішно додана в збірку!');
      }
    } catch (error) {
      console.error(error);
      alert('Не вийшло додати книгу до збірки :(. Спробуй ще раз.');
    }
  };
  
  const { title, description, Genre, Author, cover } = bookObject;
  const averageRating = calculateAverageRating(reviews); // Get average rating

  const getCategoryButtonClass = (category) => {
    switch (category) {
      case "currently reading":
        return "button-currently-reading";
      case "in plan":
        return "button-in-plan";
      case "abandoned":
        return "button-abandoned";
      case "completed":
        return "button-completed";
      case "favourite":
        return "button-favourite";
      default:
        return ""; // Default button color or no class
    }
  };
  
  const getCategoryButtonText = (category) => {
    switch (category) {
      case "currently reading":
        return "Читаю";
      case "in plan":
        return "В планах";
      case "abandoned":
        return "Покинуто";
      case "completed":
        return "Прочитано";
      case "favourite":
        return "Улюблені";
      default:
        return "Додати до бібліотеки"; // Default text if no category is selected
    }
  };

  const toggleDescription = () => {
    setDescriptionExpanded(prev => !prev);
  };

  return (
    <div className="book-page-container">
      <Navbar />
      <div className="book-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>

        <div className="book-description" background-color='red'>
          <div className="book-pic">
          <img src={`${process.env.REACT_APP_API_URL}/${cover}`} alt="Book Cover" className="bookCover" />
            
            {/* Tippy Tooltip with a category selection */}
            <Tippy
              content={
                <div className="tooltip-content">
                  <div className="tooltip-item" onClick={() => handleCategorySelect("currently reading")}>
                    {category === "currently reading" ? "Видалити зі списку" : "Читаю"}
                  </div>
                  <div className="tooltip-item" onClick={() => handleCategorySelect("in plan")}>
                    {category === "in plan" ? "Видалити зі списку" : "В планах"}
                  </div>
                  <div className="tooltip-item" onClick={() => handleCategorySelect("abandoned")}>
                    {category === "abandoned" ? "Видалити зі списку" : "Покинуто"}
                  </div>
                  <div className="tooltip-item" onClick={() => handleCategorySelect("completed")}>
                    {category === "completed" ? "Видалити зі списку" : "Прочитано"}
                  </div>
                  <div className="tooltip-item" onClick={() => handleCategorySelect("favourite")}>
                    {category === "favourite" ? "Видалити зі списку" : "Улюблені"}
                  </div>
                </div>
              }
              interactive={true} // Allow interactions inside the tooltip
              placement="bottom-start"
              arrow={false}
              trigger="click"
              theme="custom"
            >
              <button 
                className={`secondary-button ${getCategoryButtonClass(category)}`} 
                id='bookPageButton'>
                {getCategoryButtonText(category)}
              </button>
            </Tippy>
          </div>

          <ul className="book-stats">
            <li className="book-stat" id='name'>
              <h1>{title}</h1>
              <p>{Author?.full_name}</p>
            </li>

            <li className="book-stat" id='genre'>
              <h4>Жанр</h4>
              <p>{Genre?.name}</p>
            </li>

            <li className="book-stat" id='rating'>
              <h4>Рейтинг</h4>
              {/* Render stars based on average rating */}
              <div className="review-rating">
                {Array.from({ length: Math.round(averageRating) }, (_, i) => (
                  <span key={i}>&#9733;</span>
                ))}
                {Array.from({ length: 5 - Math.round(averageRating) }, (_, i) => (
                  <span key={i}>&#9734;</span>
                ))}
              </div>
            </li>

            <li className="book-stat" id='description'>
              <p>
                {isDescriptionExpanded ? description : `${(description || "").slice(0, 200)}...`}
              </p>
              <a onClick={toggleDescription}>
                {isDescriptionExpanded ? "Показати менше <-" : "Показати більше ->"}
              </a>
            </li>
          </ul>
        </div>

        <div className="reviewSection">
          <button className="secondary-button" id='bookPageReviewButton' onClick={() => setModalOpen(true)}>
            Додати відгук
          </button>

          {/* Render reviews here */}
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <img
               src={review.User?.profilePicture ? `${process.env.REACT_APP_API_URL}/${review.User.profilePicture}` : `${process.env.REACT_APP_API_URL}/pfps/311e7ad01e414f0821610c9c4f7a48ae.jpg`}
               alt="Reviewer"
               className="profile-pic"
              />
              <h3>{review.User?.nickname}</h3> 
              <div className="review-rating">
                {Array.from({ length: review.rating }, (_, i) => (
                  <span key={i}>&#9733;</span>
                ))}
                {Array.from({ length: 5 - review.rating }, (_, i) => (
                  <span key={i}>&#9734;</span>
                ))}
              </div>
              <p className="review-text">{review.review_text}</p>
            </div>
          ))}
        </div>

        {/* Modal for adding reviews */}
        <ReviewModal 
          isOpen={isModalOpen} 
          onClose={() => setModalOpen(false)} 
          onSubmit={handleAddReview} 
        />
      </div>
    </div>
  );
}

export default BookPage;