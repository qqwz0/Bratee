import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import ProfileHeader from '../ProfilePage/Components/Header/ProfileHeader';
import Navbar from '../../Components/Navbar/Navbar';
import ReviewsContainer from './ReviewsContainer';

import './ProfileReviewsPage.css';

function ProfileReviewsPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]); // State for reviews

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:3001/users/${id}`);
                setUser(userResponse.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        const fetchReviews = async () => {
            try {
                const reviewsResponse = await axios.get(`http://localhost:3001/reviews/byUserId/${id}`);
                setReviews(reviewsResponse.data); // Set the fetched reviews
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };

        fetchUser();
        fetchReviews();
    }, [id]);

    return (
        <div className="profile-page">
            <Navbar className="navbar" />
            <ProfileHeader className="profile-header" nickname={user?.nickname} email={user?.email} pfp={user?.profilePicture} />
            <ReviewsContainer reviews={reviews} />
        </div>
    );
}

export default ProfileReviewsPage;
