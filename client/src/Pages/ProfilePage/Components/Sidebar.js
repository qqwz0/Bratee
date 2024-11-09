import React from 'react';
import Statistics from './Statistics';

const Sidebar = ({ setSortOption, setIsAscending, sortOption, isAscending }) => {
    return (
        <aside className="sidebar">
            <Statistics setSortOption={setSortOption} setIsAscending={setIsAscending} sortOption={sortOption} isAscending={isAscending}/>
        </aside>
    );
};

export default Sidebar;