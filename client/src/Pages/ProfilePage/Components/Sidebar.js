import React from 'react';
import Statistics from './Statistics';

const Sidebar = ({ setSortOption, setIsAscending, sortOption, isAscending, variant, onCategoryChange, category, categoryCounts }) => {
    return (
        <aside className="sidebar">
            <Statistics 
            setSortOption={setSortOption}
            setIsAscending={setIsAscending} 
            sortOption={sortOption} 
            isAscending={isAscending} 
            variant={variant} 
            onCategoryChange={onCategoryChange} 
            category={category}
            categoryCounts={categoryCounts}/>
        </aside>
    );
};

export default Sidebar;