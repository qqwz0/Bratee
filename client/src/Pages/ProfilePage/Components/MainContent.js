import React from 'react';
import ListItem from './ListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const MainContent = ({ items, onDelete, openCreateBookModal, setFilterText, variant }) => {
    console.log("MainContent items:", items);
    return (
        <main className="main-content">
            <div className="filter-container">
                <input 
                    type="text" 
                    placeholder="Фільтр за назвою/ автором" 
                    className="input-filter" 
                    onChange={(e) => setFilterText(e.target.value)}
                />
                {!variant && (
                    <button className='addabook' onClick={openCreateBookModal}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                )}
            </div>
            <div className="items-container">
                {Array.isArray(items) && items.map((item) => (
                    <ListItem key={item.id} item={item} onDelete={onDelete} variant={variant} />
                ))}
            </div>
        </main>
    );
};

export default MainContent;
