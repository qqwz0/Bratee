import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

import ProfileHeader from './Components/Header/ProfileHeader';
import Navbar from '../../Components/Navbar/Navbar';
import CreateBook from './Components/CreateBookModal/CreateBookModal';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';

import './ProfilePage.css';

function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]); // Книги, взяті користувачем
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterText, setFilterText] = useState(""); // Текст для фільтрації
    const [sortOption, setSortOption] = useState("Назвою (A - Z)"); // Опція сортування за замовчуванням
    const [isAscending, setIsAscending] = useState(true); // Напрямок сортування

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
                setUser(response.data);

                // Отримання книг, взятих користувачем
                const booksResponse = await axios.get(`${process.env.REACT_APP_API_URL}/books/byUserId/${id}`);
                setItems(booksResponse.data);
            } catch (err) {
                console.log("Помилка при отриманні даних користувача:", err);
            }
        };
        fetchUser();
    }, [id]);

    const toggleModal = () => {
        console.log("Виклик функції переключення модального вікна");
        setIsModalOpen(prev => !prev);
    };

    const openCreateBookModal = () => {
        setIsModalOpen(true); // Відкрити модальне вікно
    };

    const onAddBook = (newBook) => {
        setItems(prevItems => [...prevItems, newBook]); // Додати нову книгу
    };

    const filteredItems = items.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(filterText.toLowerCase());
        const authorMatch = item.Author?.full_name && item.Author?.full_name.toLowerCase().includes(filterText.toLowerCase());
        return titleMatch || authorMatch; // Збіг за назвою або автором
    });

    const onDelete = (bookId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== bookId));
    };

    const sortItems = (items) => {
        return [...items].sort((a, b) => {
            if (sortOption === "Назвою (A - Z)") {
                return isAscending
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            } else if (sortOption === "Датою додавання в бібліотеці") {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);

                if (isNaN(dateA) || isNaN(dateB)) {
                    console.error('Невірний формат дати');
                    return 0;
                }

                return isAscending ? dateA - dateB : dateB - dateA;
            } else if (sortOption === "Рейтингом") {
                return isAscending ? a.rating - b.rating : b.rating - a.rating;
            }
            return 0;
        });
    };

    const sortedFilteredItems = sortItems(filteredItems);

    return (
        <div className="profile-page">
            <Navbar className="navbar" /> {/* Навігаційна панель */}
            <ProfileHeader
                className="profile-header"
                nickname={user?.nickname}
                email={user?.email}
                pfp={user?.profilePicture}
            /> {/* Заголовок профілю */}
            <div className="flex-container">
                <Sidebar
                    setSortOption={setSortOption}
                    setIsAscending={setIsAscending}
                    sortOption={sortOption}
                    isAscending={isAscending}
                /> {/* Бокова панель */}
                <MainContent
                    items={sortedFilteredItems}
                    setItems={setItems}
                    openCreateBookModal={openCreateBookModal}
                    setFilterText={setFilterText}
                    onDelete={onDelete}
                /> {/* Основна частина */}
            </div>
            {isModalOpen && (
                <CreateBook isOpen={isModalOpen} onClose={toggleModal} onAddBook={onAddBook} />
            )} {/* Модальне вікно для створення книги */}
        </div>
    );
}

export default ProfilePage;
