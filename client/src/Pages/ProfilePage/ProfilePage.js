import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import ProfileHeader from './Components/Header/ProfileHeader';
import Navbar from '../../Components/Navbar/Navbar';
import CreateBook from './Components/CreateBookModal/CreateBookModal';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';

import './ProfilePage.css'; // Import the CSS file

function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]); // State for storing books taken by the userv
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterText, setFilterText] = useState(""); // Text for filtering by title or author
    const [sortOption, setSortOption] = useState("Назвою (A - Z)"); // Default sort option
    const [isAscending, setIsAscending] = useState(true); // Default ascending order

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

    const filteredItems = items.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(filterText.toLowerCase());
        const authorMatch = item.Author?.full_name && item.Author?.full_name.toLowerCase().includes(filterText.toLowerCase());
        return titleMatch || authorMatch; // Match either title or author
    });

    const sortItems = (items) => {
        return [...items].sort((a, b) => {
            if (sortOption === "Назвою (A - Z)") {
                return isAscending
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            } else if (sortOption === "Датою додавання в бібліотеці") {
                return isAscending
                    ? new Date(a.CreatedAt) - new Date(b.CreatedAt)
                    : new Date(b.CreatedAt) - new Date(a.CreatedAt);
            } else if (sortOption === "Рейтингом") {
                return isAscending ? a.rating - b.rating : b.rating - a.rating;
            }
            return 0;
        });
    };

    const sortedFilteredItems = sortItems(filteredItems); // Sort the filtered items

    return (
        <div className="profile-page">
            <Navbar className="navbar" /> {/* Navbar at the top */}
            <ProfileHeader className="profile-header" nickname={user?.nickname} email={user?.email} pfp={user?.profilePicture}/> {/* Profile header */}
            <div className="flex-container">
                <Sidebar 
                setSortOption={setSortOption} 
                setIsAscending={setIsAscending} 
                sortOption={sortOption}
                isAscending={isAscending}
                /> 
                <MainContent items={sortedFilteredItems} setItems={setItems} openCreateBookModal={openCreateBookModal} setFilterText={setFilterText}/> {/* Main content area */}
            </div>
            {isModalOpen && (
            <CreateBook isOpen={isModalOpen} onClose={toggleModal} onAddBook={onAddBook}/>
             )}
        </div>
    );
}

export default ProfilePage;