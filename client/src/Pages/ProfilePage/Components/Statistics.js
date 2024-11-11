import React from 'react';

const Statistics = ({ sortOption, setSortOption, isAscending, setIsAscending, variant, onCategoryChange, category, categoryCounts }) => {
    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const handleOrderChange = (order) => {
        setIsAscending(order === 'ascending');
    };

    const SortOption = ({ label, isOrder, onChange, isChecked }) => (
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

    return (
        <div className="statistics">
            <div className="sort-options">
                {variant === 'withCategories' && (
                    <div className="categories">
                        <ul>
                            {['Всі', 'Читаю', 'В планах', 'Покинуто', 'Прочитано', 'Улюблені'].map((cat, index) => (
                                <li 
                                    key={index} 
                                    className={`sort-list category ${category === cat ? 'selected' : ''}`}  
                                    onClick={() => onCategoryChange(cat)} // Pass the selected category
                                    style={{display: 'flex', justifyContent: 'space-between'}}
                                >
                                    {cat} 
                                    <span className="category-count">
                                        {categoryCounts[cat]}  {/* Display the count of books in this category */}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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
