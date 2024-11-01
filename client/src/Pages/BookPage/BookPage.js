import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import BannerBackground from "../../Assets/home-banner-background.png";
import "./BookPage.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewModal from "./ReviewModal"; // Import your modal component

function BookPage() {
  const { id } = useParams();
  const [bookObject, setBookObject] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const bookResponse = await axios.get(`http://localhost:3001/books/byId/${id}`);
        setBookObject(bookResponse.data);
        
        const reviewsResponse = await axios.get(`http://localhost:3001/reviews/${id}`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndReviews();
  }, [id]);

  const handleAddReview = async (newReview) => {
    const accessToken = sessionStorage.getItem('accessToken');
  
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
  
      // Update the reviews state with the complete review object from the server
      setReviews((prev) => [...prev, response.data]);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching book details: {error.message}</div>;

  const { title, genre, description, Genre, Author, cover } = bookObject;
  const averageRating = calculateAverageRating(reviews); // Get average rating

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
            <button className="secondary-button" id='bookPageButton'>
              Add to the library
            </button>
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
              <img src="https://via.placeholder.com/100" alt="Reviewer" className="profile-pic" />
              <h3>{review.nickname}</h3> 
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