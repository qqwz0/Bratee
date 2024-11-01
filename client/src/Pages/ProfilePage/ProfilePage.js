import React, { useEffect, useState } from 'react';
import ProfileHeader from './Components/Header/ProfileHeader';
import Navbar from '../../Components/Navbar/Navbar';
import { useParams } from "react-router-dom";
import axios from 'axios';
import './ProfilePage.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import BookModal from './Components/Modal/ChangeBookModal';
import CreateBook from '../CreateBook/CreateBook';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <Statistics />
        </aside>
    );
};

const Statistics = () => {
    return (
        <div className="statistics">
            <SortOptions />
        </div>
    );
};

const SortOptions = () => {
    return (
        <div className="sort-options">
            <div className="sort-title">Сортування за</div>
            <div className="sort-list">
                {['Назвою (A - Z)', 'Датою додавання в бібліотеку', 'Рейтингом'].map(option => (
                    <SortOption key={option} label={option} />
                ))}
                <hr className="separator" />
                {['За спаданням', 'За зростанням'].map(option => (
                    <SortOption key={option} label={option} isOrder />
                ))}
            </div>
        </div>
    );
};

const SortOption = ({ label, isOrder }) => {
    return (
        <div className="sort-option">
            <input type="radio" name={isOrder ? "order" : "sort"} />
            <span>{label}</span>
        </div>
    );
};

const MainContent = ({ items, setItems }) => {
    const handleDelete = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    console.log('Items:', items); // Debugging line

    return (
        <main className="main-content">
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Фільтр за назвою/ автором"
                    className="input-filter"
                />
                <button className='addabook'> <FontAwesomeIcon icon={faPlus}/></button>
            </div>
            <div className="items-container">
                {Array.isArray(items) &&
                    items.map((item) => (
                        <ListItem
                            key={item.id}
                            item={item}
                            setItems={setItems} // Pass setItems here
                            onDelete={handleDelete}
                        />
                    ))}
            </div>
        </main>
    );
};

const ListItem = ({ item, setItems, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localTitle, setLocalTitle] = useState(item.title);

    // Ensure the date is parsed correctly or fallback to an empty string
    const formattedDate = item.CreatedAt
        ? new Date(item.CreatedAt).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        : 'N/A'; // Handle cases where CreatedAt might be undefined

        const handleUpdate = async (updatedData) => {
            const formData = new FormData();
            formData.append('title', updatedData.title);
            formData.append('description', updatedData.description);
            formData.append('genreId', updatedData.genreId || '');
            formData.append('authorId', updatedData.authorId || '');
        
            if (updatedData.coverFile) {
                formData.append('cover', updatedData.coverFile);
            }
        
            try {
                const response = await fetch(`http://localhost:3001/books/${updatedData.id}`, {
                    method: 'PUT',
                    body: formData,
                });
        
                if (response.ok) {
                    const updatedBook = await response.json();
                    console.log('Book updated successfully:', updatedBook);
        
                    // Update the UI state to reflect the new cover path with a cache-busting query
                    setItems((prevItems) => 
                        prevItems.map((item) => 
                            item.id === updatedBook.book.id 
                                ? { 
                                    ...item, 
                                    title: updatedBook.book.title, 
                                    description: updatedBook.book.description, 
                                    cover: `${updatedBook.book.cover}?t=${new Date().getTime()}` // Force re-fetch
                                  }
                                : item
                        )
                    );
                } else {
                    console.error('Failed to update book');
                }
            } catch (error) {
                console.error('Error updating book:', error);
            }
        };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/books/${item.id}`);
            onDelete(item.id); // Update the UI
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    return (
        <div className="list-item">
            <div className="item-content">
                <img
                    src={item.cover ? `http://localhost:3001/${item.cover}` : ''}
                    alt={item.alt}
                    className="item-image"
                />
                <div className="item-details">
                    <div className="item-title">{localTitle}</div>
                    <div className="item-author">{item.Author?.full_name}</div>
                </div>
            </div>
            <div className="item-date">
                Додано {formattedDate}
            </div>
            <div className="item-options" onClick={() => setIsModalOpen(true)}>
                <FontAwesomeIcon icon={faEllipsisH} />
            </div>
            <BookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                book={{ ...item, title: localTitle }}
                onUpdate={handleUpdate}
                onDelete={() => {
                    handleDelete();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};


function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]); // State for storing books taken by the user
    const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false);

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/users/${id}`);
                setUser(response.data);
            } catch (err) {
                console.log("Error fetching user data:", err);
            }
        };
        fetchUser();
    }, [id]);

    return (
        <div className="profile-page">
            <Navbar className="navbar" /> {/* Navbar at the top */}
            <ProfileHeader className="profile-header" nickname={user?.nickname} email={user?.email} /> {/* Profile header */}
            <div className="flex-container">
                <Sidebar /> {/* Sidebar on the left */}
                <MainContent items={items} setItems={setItems} /> {/* Main content area */}
            </div>
        </div>
    );
}

export default ProfilePage;