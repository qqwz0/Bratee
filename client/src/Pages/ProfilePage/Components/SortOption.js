import React from 'react';

const SortOption = ({ label, isOrder }) => {
    return (
        <div className="sort-option">
            <input type="radio" name={isOrder ? "order" : "sort"} />
            <span>{label}</span>
        </div>
    );
};

export default SortOption;