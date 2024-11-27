import React from 'react';
import ListItem from './ListItem';

// Іконки
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const MainContent = ({ items, onDelete, setItems, openCreateBookModal, setFilterText, variant }) => {
    console.log("MainContent items:", items);

    return (
        <main className="main-content">
            {/* Контейнер для фільтрації */}
            <div className="filter-container">
                <input 
                    type="text" 
                    placeholder="Фільтр за назвою/автором" 
                    className="input-filter" 
                    onChange={(e) => setFilterText(e.target.value)} // Виклик функції для фільтрації
                />
                
                {/* Кнопка для додавання книги, якщо не переданий варіант */}
                {!variant && (
                    <button className="addabook" onClick={openCreateBookModal}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                )}
            </div>

            {/* Контейнер для списку книг */}
            <div className="items-container">
                {Array.isArray(items) && items.length > 0 ? (
                    items.map((item) => (
                        <ListItem key={item.id} item={item} setItems={setItems} onDelete={onDelete} variant={variant} />
                    ))
                ) : (
                    <div className="no-books-message">
                        <p>Книг не знайдено.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default MainContent;
