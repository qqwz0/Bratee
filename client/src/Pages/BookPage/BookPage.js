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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [category, setCategory] = useState(null); // State for selected category

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const bookResponse = await axios.get(`http://localhost:3001/books/byId/${id}`);
        setBookObject(bookResponse.data);
        
        const reviewsResponse = await axios.get(`http://localhost:3001/reviews/${id}`);
        setReviews(reviewsResponse.data);
  
        const userId = getUserId();
        console.log(userId, id);
        
        if (userId) {
          try {
            const categoriesResponse = await axios.get(`http://localhost:3001/likedbooks/${userId}/${id}`);
            console.log("Categories Response Status:", categoriesResponse.status);  // Log status code
            console.log("Categories Response Data:", categoriesResponse.data);  // Log the data of categories response
            
            // Check for 404 explicitly or handle absence of likedBook
            if (categoriesResponse.status === 404) {
              console.log("Book not found in user's liked list.");
              setCategory(null);  // Set category to null if not found
            } else if (categoriesResponse.data && categoriesResponse.data.likedBook && categoriesResponse.data.likedBook.category) {
              setCategory(categoriesResponse.data.likedBook.category);  // Access category from likedBook object
            } else {
              console.log("No category found for this book.");
              setCategory(null);  // In case no category is found
            }
          } catch (error) {
            console.error("Error fetching liked books:", error);  // Log error in case of other issues
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
      alert("You must be logged in to add a review.");
      return;
    }
  
    try {
      // Post the review to the server and receive the full response with nickname
      const response = await axios.post(
        'http://localhost:3001/reviews/', 
        { ...newReview, BookId: id }, 
        {
          headers: { accessToken },
        }
      );

      console.log('New review data:', response.data);
  
      // Update the reviews state with the complete review object from the server
      setReviews((prev) => [...prev, response.data]);

      const updatedAverageRating = calculateAverageRating([...reviews, response.data]);
      
      await axios.put(`http://localhost:3001/books/rating/${id}`, {rating: updatedAverageRating});

    } catch (err) {
      console.error("Error adding review:", err);
      alert("Error adding review. Please try again.");
    }
    
  };
  
  // Calculate the average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0; // No reviews, return 0

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Return average rating, fixed to 1 decimal place
  };

  const handleCategorySelect = async (selectedCategory) => {
    // Get userId from the decoded token
    const userId = getUserId();
  
    // Check if the user is logged in
    if (!userId) {
      alert('You must be logged in to modify your book categories.');
      return;
    }
  
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('You must be logged in to modify your book categories.');
      return;
    }
  
    // If the selected category is already the current category, remove it from both the UI and the database
    if (category === selectedCategory) {
      setCategory(null); // Reset the category to null
  
      try {
        // Make a DELETE request to remove the category from the user's liked books
        const response = await axios.delete(
          `http://localhost:3001/likedbooks`,
          {
            headers: { accessToken },
            data: { userId: userId, bookId: id, category: selectedCategory },
          }
        );
  
        if (response.status === 200) {
          alert('Category removed successfully!');
        }
      } catch (error) {
        console.error(error);
        alert('Failed to remove the category. Please try again.');
      }
  
      return; // Exit the function early since the category was removed
    }
  
    // Set the category and add it to the database only if the user is logged in
    setCategory(selectedCategory);
  
    try {
      const response = await axios.post(
        'http://localhost:3001/likedbooks',
        { userId: userId, bookId: id, category: selectedCategory },
        { headers: { accessToken } }
      );
  
      if (response.status === 201) {
        alert('Category added successfully!');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to add the category. Please try again.');
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching book details: {error.message}</div>;

  const { title, genre, description, Genre, Author, cover } = bookObject;
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

  return (
    <div className="book-page-container">
      <Navbar />
      <div className="book-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>

        <div className="book-description" background-color='red'>
          <div className="book-pic">
          <img src={`http://localhost:3001/${cover}`} alt="Book Cover" className="bookCover" />
            
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
              <h4>Genre</h4>
              <p>{Genre?.name}</p>
            </li>

            <li className="book-stat" id='rating'>
              <h4>Rating</h4>
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
              <h4>Description</h4>
              <p>{description}</p>
            </li>
          </ul>
        </div>

        <div className="reviewSection">
          <button className="secondary-button" id='bookPageReviewButton' onClick={() => setModalOpen(true)}>
            Add a review
          </button>

          {/* Render reviews here */}
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <img
               src={review.User?.profilePicture ? `http://localhost:3001/${review.User.profilePicture}` : `http://localhost:3001/pfps/311e7ad01e414f0821610c9c4f7a48ae.jpg`}
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