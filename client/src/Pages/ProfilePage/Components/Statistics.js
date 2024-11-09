import React from 'react';

const Statistics = ({  sortOption, setSortOption, isAscending, setIsAscending }) => {
    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const handleOrderChange = (order) => {
        setIsAscending(order === 'ascending');
    };

    const SortOption = ({ label, isOrder, onChange, isChecked }) => {
        return (
            <div className="sort-option">
                <input 
                    type="radio" 
                    name={isOrder ? "order" : "sort"} 
                    onChange={onChange} 
                    checked={isChecked} 
                />
                <span>{label}</span>
            </div>
        );
    };

    return (
        <div className="statistics">
            <div className="sort-options">
                <div className="sort-title">Сортування за</div>
                <div className="sort-list">
                    {['Назвою (A - Z)', 'Датою додавання в бібліотеці', 'Рейтингом'].map(option => (
                        <SortOption 
                            key={option} 
                            label={option} 
                            isChecked={sortOption === option} 
                            onChange={() => handleSortChange(option)} 
                        />
                    ))}
                    <hr className="separator" />
                    {['За спаданням', 'За зростанням'].map(option => (
                        <SortOption 
                            key={option} 
                            label={option} 
                            isOrder 
                            isChecked={isAscending ? option === 'За зростанням' : option === 'За спаданням'} 
                            onChange={() => handleOrderChange(option === 'За зростанням' ? 'ascending' : 'descending')} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Statistics;