import React, { useState } from 'react';
import { Link } from "react-router-dom";
import BookModal from './Modal/ChangeBookModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ListItem = ({ item, setItems, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localTitle, setLocalTitle] = useState(item.title);

    const formattedDate = item.CreatedAt
        ? new Date(item.CreatedAt).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        : 'N/A';

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
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === updatedBook.book.id
                            ? {
                                ...item,
                                title: updatedBook.book.title,
                                description: updatedBook.book.description,
                                cover: `${updatedBook.book.cover}?t=${new Date().getTime()}`,
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
            onDelete(item.id);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    return (
        <div className="list-item">
            <div className="item-content">
                <img
                    src={item.cover ? `http://localhost:3001/${item.cover}` : ''}
                    alt={item.title}
                    className="item-image"
                />
                <div className="item-details">
                    <Link to={`/book/${item.id}`} className="item-title">{item.title}</Link>
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

export default ListItem;