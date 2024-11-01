import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons';

import ProfileHeader from './Components/Header/ProfileHeader';
import Navbar from '../../Components/Navbar/Navbar';
import BookModal from './Components/Modal/ChangeBookModal';
import CreateBook from './Components/CreateBookModal/CreateBookModal';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';

import './ProfilePage.css'; // Import the CSS file

function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]); // State for storing books taken by the userv
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/${id}`);
                setUser(response.data);
                // Fetch books taken by the user
                const booksResponse = await axios.get(`http://localhost:3001/books/byUserId/${id}`);
                setItems(booksResponse.data);
            } catch (err) {
                console.log("Error fetching user data:", err);
            }
        };
        fetchUser();
    }, [id]);

    const toggleModal = () => {
        console.log("Toggle Modal function called");
        setIsModalOpen(prev => !prev);
    };

    const openCreateBookModal = () => {
        setIsModalOpen(true); // Set the modal to open
    };

    const onAddBook = (newBook) => {
        setItems(prevItems => [...prevItems, newBook]); // Add the new book to the existing items
    };

    return (
        <div className="profile-page">
            <Navbar className="navbar" /> {/* Navbar at the top */}
            <ProfileHeader className="profile-header" nickname={user?.nickname} email={user?.email} /> {/* Profile header */}
            <div className="flex-container">
                <Sidebar /> {/* Sidebar on the left */}
                <MainContent items={items} setItems={setItems} openCreateBookModal={openCreateBookModal}/> {/* Main content area */}
            </div>
            {isModalOpen && (
            <CreateBook isOpen={isModalOpen} onClose={toggleModal} onAddBook={onAddBook}/>
             )}
        </div>
    );
}

export default ProfilePage;