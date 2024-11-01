import React from 'react';
import ListItem from './ListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const MainContent = ({ items, setItems, openCreateBookModal }) => {
    const handleDelete = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    return (
        <main className="main-content">
            <div className="filter-container">
                <input type="text" placeholder="Фільтр за назвою/ автором" className="input-filter" />
                <button className='addabook' onClick={openCreateBookModal}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <div className="items-container">
                {Array.isArray(items) && items.map((item) => (
                    <ListItem key={item.id} item={item} setItems={setItems} onDelete={handleDelete} />
                ))}
            </div>
        </main>
    );
};

export default MainContent;