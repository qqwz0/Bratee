import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import ProfileHeader from '../ProfilePage/Components/Header/ProfileHeader';
import Navbar from '../../Components/Navbar/Navbar';
import MainContent from '../ProfilePage/Components/MainContent';
import Sidebar from '../ProfilePage/Components/Sidebar';

import './ProfileCollection.css';

const categoryMap = {
    'Всі': 'all',
    'Читаю': 'currently reading',
    'В планах': 'in plan',
    'Покинуто': 'abandoned',
    'Прочитано': 'completed',
    'Улюблені': 'favourite'
};

function ProfileCollectionsPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [allBooks, setAllBooks] = useState([]); // Store all books once
    const [books, setBooks] = useState([]); // Filtered books based on selected category
    const [category, setCategory] = useState('Всі'); // Default category is 'all'
    const [filterText, setFilterText] = useState(""); // Text for filtering by title or author
    const [sortOption, setSortOption] = useState("Назвою (A - Z)"); // Default sort option
    const [isAscending, setIsAscending] = useState(true); // Default ascending order
    const [categoryCounts, setCategoryCounts] = useState({
        'Всі': 0,
        'Читаю': 0,
        'В планах': 0,
        'Покинуто': 0,
        'Прочитано': 0,
        'Улюблені': 0
    });

    useEffect(() => {
    const fetchUser = async () => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
            setUser(userResponse.data);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const fetchAllBooks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/likedBooks/${id}`);
            const likedBooks = response.data.likedBooks.map(item => ({
                ...item.book,
                updatedAt: item.updatedAt,
                category: item.category
            }));
            setAllBooks(likedBooks);
            setBooks(likedBooks); // Initialize with all books by default

            // Calculate category counts
            const newCategoryCounts = {
                'Всі': likedBooks.length,
                'Читаю': likedBooks.filter(book => book.category === 'currently reading').length,
                'В планах': likedBooks.filter(book => book.category === 'in plan').length,
                'Покинуто': likedBooks.filter(book => book.category === 'abandoned').length,
                'Прочитано': likedBooks.filter(book => book.category === 'completed').length,
                'Улюблені': likedBooks.filter(book => book.category === 'favourite').length
            };
            setCategoryCounts(newCategoryCounts);

        } catch (err) {
            console.error("Error fetching books:", err);
        }
    };

    fetchUser();
    fetchAllBooks();
}, [id]);

useEffect(() => {
    // Filter books based on selected category
    if (categoryMap[category] === 'all') {
        setBooks(allBooks);
    } else {
        setBooks(allBooks.filter(book => book.category === categoryMap[category]));
    }
}, [category, allBooks]);

     // Filter books by title and author name
    const filteredItems = books.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(filterText.toLowerCase());
        const authorMatch = item.Author?.full_name && item.Author?.full_name.toLowerCase().includes(filterText.toLowerCase());
        return titleMatch || authorMatch;
    });

    // Sort books based on selected sort option and order
    const sortItems = (items) => {
        return [...items].sort((a, b) => {
            if (sortOption === "Назвою (A - Z)") {
                return isAscending
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            } else if (sortOption === "Датою додавання в бібліотеці") {
                return isAscending
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortOption === "Рейтингом") {
                return isAscending ? a.rating - b.rating : b.rating - a.rating;
            }
            return 0;
        });
    };

    const sortedFilteredItems = sortItems(filteredItems);

    return (
        <div className="profile-page">
            <Navbar className="navbar" />
            <ProfileHeader 
                className="profile-header" 
                nickname={user?.nickname} 
                email={user?.email} 
                pfp={user?.profilePicture} 
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Sidebar 
                    variant={'withCategories'} 
                    setFilterText={setFilterText}
                    onCategoryChange={setCategory} 
                    setSortOption={setSortOption} 
                    setIsAscending={setIsAscending} 
                    sortOption={sortOption}
                    isAscending={isAscending}
                    category={category}
                    categoryCounts={categoryCounts}
                />
                <MainContent items={sortedFilteredItems}
                setFilterText={setFilterText}
                variant={'withCategories'}  
                /> 
            </div>
        </div>
    );
}

export default ProfileCollectionsPage;
