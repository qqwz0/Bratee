import React from 'react';
import SortOption from './SortOption';

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

export default SortOptions;