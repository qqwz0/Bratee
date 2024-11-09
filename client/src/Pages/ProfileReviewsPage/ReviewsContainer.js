import { React, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./ProfileReviewsPage.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const renderStars = (rating) => {
    const validRating = Math.max(0, Math.min(5, Number(rating))); // Ensure rating is between 0 and 5
    const stars = [];

    for (let i = 0; i < 5; i++) {
        stars.push(
            <span key={i} className="star">
                {i < validRating ? '★' : '☆'}
            </span>
        );
    }
    return <div className="rating-stars">{stars}</div>;
};

const FilterSidebar = () => (
    <div className="filterSidebar">
        {/* <h2 className="filterTitle">Фильтр комментариев</h2>
        <ul>
            {['Все', 'К манге', 'К главам', 'К аниме', 'К сериям', 'К новости'].map((label, index) => (
                <li className="filterItem" key={index}>
                    <label>
                        <input type="radio" name="filter" className="radio" />
                        {label}
                    </label>
                </li>
            ))}
        </ul> */}
    </div>
);

const ReviewsContainer = ({ reviews }) => {
    const [reviewList, setReviewList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Initialize reviewList with the provided reviews when the component mounts
        setReviewList(reviews);
    }, [reviews]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this review?");
        if (!confirmDelete) return;

        try {
            const accessToken = localStorage.getItem('accessToken');

            await axios.delete(`http://localhost:3001/reviews/${id}`, {
                headers: { accessToken }
            });

            setReviewList(reviewList.filter(review => review.id !== id));
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("Failed to delete the review. Please try again.");
        }
    };

    const handleSearch = () => {
        const filteredReviews = reviews.filter(review =>
            review.review_text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setReviewList(filteredReviews);
    };

    const resetReviews = () => {
        setReviewList(reviews); // Reset to show all reviews
    };

    return (
        <div className="container">
            <FilterSidebar />
            <CommentsSection
                reviews={reviewList}
                onDelete={handleDelete}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
                resetReviews={resetReviews} // Pass the reset function
            />
        </div>
    );
};

const CommentsSection = ({ reviews, onDelete, searchTerm, setSearchTerm, onSearch, resetReviews }) => (
    <div className="commentsSection">
        <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={onSearch}
            resetReviews={resetReviews} // Pass resetReviews to SearchBar
        />
        <div>
            {reviews.map((comment, index) => {
                const formattedDate = comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString('uk-UA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })
                    : 'N/A';

                    console.log("Book id here", comment);
                    

                return (
                    <Comment
                        key={index}
                        id={comment.id}
                        title={comment.Book?.title}
                        stars={comment.rating}
                        text={comment.review_text}
                        time={formattedDate}
                        image={comment.Book?.cover}
                        bookId={comment.BookId} // Pass the book ID here
                        onDelete={onDelete}
                    />
                );
            })}
        </div>
    </div>
);

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, resetReviews }) => {
    const handleClear = () => {
        setSearchTerm(""); // Clear the search term
        resetReviews();    // Show all reviews immediately
    };

    return (
        <div className="filter-container">
            <div className="input-icon-container">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Пошук за текстом" 
                    className="input-filter" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <FontAwesomeIcon 
                        icon={faTimes} 
                        className="clear-icon" 
                        onClick={handleClear}
                    />
                )}
            </div>
            <button className="secondary-button" onClick={onSearch}>Пошук</button>
        </div>
    );
};

const Comment = ({ id, title, stars, text, time, image, bookId, onDelete }) => (
    <div className="comment">
        <img src={`http://localhost:3001/${image}`} alt="Book icon" className="commentImage" />
        <div style={{width: '100%'}}>
            <div className="commentHeader">
                <div>
                <h3 className="commentTitle">
                        Огляд на книгу <Link to={`/book/${bookId}`} className="book-link">{title}</Link>
                    </h3>
                </div>
                <div className="commentStars">
                    {renderStars(stars)}
                </div>
            </div>
            <p className="commentText">{text}</p>
            <div className="commentTime">
                <span className="commentTime">Додано {time}</span>
                <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={() => onDelete(id)}/>
            </div>
        </div>
    </div>
);

export default ReviewsContainer;
