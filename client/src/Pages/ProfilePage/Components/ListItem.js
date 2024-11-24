import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

// Компоненти
import BookModal from './Modal/ChangeBookModal';

// Іконки
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const ListItem = ({ item, setItems, onDelete, variant }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Форматування дати
    const formattedDate =
        variant === 'withCategories' && item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString('uk-UA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
            : item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                })
                : 'Н/Д';

    // Оновлення книги
    const handleUpdate = async (updatedData) => {
        console.log("Оновлені дані:", updatedData);

        const formData = new FormData();
        formData.append('title', updatedData.title);
        formData.append('description', updatedData.description);
        formData.append('UserId', updatedData.userId);

        if (updatedData.coverFile) {
            formData.append('cover', updatedData.coverFile);
        }

        try {
            const response = await axios.put(`http://localhost:3001/books/${updatedData.id}`, formData);

            if (response.status === 200) {
                console.log('Книгу успішно оновлено:', response.data);
            } else {
                console.error('Помилка оновлення книги');
            }
        } catch (error) {
            console.error('Помилка оновлення книги:', error);
        }
    };

    // Видалення книги
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/books/${item.id}`);
            onDelete(item.id);
        } catch (error) {
            console.error('Помилка видалення книги:', error);
        }
    };

    // Рендер зірок рейтингу
    const renderStars = (rating) => {
        const validRating = Math.max(0, Math.min(5, Number(rating))); // Рейтинг між 0 і 5
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

    return (
        <div
            className={`list-item 
                ${item.status === 'pending' ? 'pending' : ''} 
                ${item.status === 'rejected' ? 'rejected' : ''} 
                ${item.status === 'pending-update' ? 'pending-update' : ''}`}
        >
            {/* Статуси книги */}
            {item.status === 'pending' && <div className="pending-badge">Очікує</div>}
            {item.status === 'pending-update' && <div className="pending-badge">Очікує оновлення</div>}
            {item.status === 'rejected' && <div className="rejected-badge">Відхилено</div>}

            {/* Вміст книги */}
            <div className="item-content">
                <img
                    src={item.cover ? `http://localhost:3001/${item.cover}` : ''}
                    alt={item.title}
                    className="item-image"
                />
                <div className="item-details">
                    <Link to={`/book/${item.id}`} className="item-title">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            {item.title} / {renderStars(item.rating)}
                        </span>
                    </Link>
                    <div className="item-author">{item.Author?.full_name}</div>
                </div>
            </div>

            {/* Дата додавання */}
            <div className="item-date">
                {variant === 'withCategories'
                    ? <>
                        Додано в колекцію
                        <br />
                        {formattedDate}
                    </>
                    : <>
                        Додано
                        <br />
                        {formattedDate}
                    </>}
            </div>

            {/* Опції книги */}
            {variant !== 'withCategories' && item.status !== 'pending' && (
                <div className="item-options" onClick={() => setIsModalOpen(true)}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </div>
            )}

            {/* Модальне вікно для редагування книги */}
            <BookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                book={{ ...item }}
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
