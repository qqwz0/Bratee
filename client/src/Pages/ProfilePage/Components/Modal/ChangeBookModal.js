import React, { useState, useEffect } from 'react';
import './ChangeBookModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const BookModal = ({ isOpen, onClose, book, onUpdate, onDelete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState('');
    const [coverFile, setCoverFile] = useState(null);

    const serverUrl = `${process.env.REACT_APP_API_URL}` + '/';

    useEffect(() => {
        if (book) {
            setTitle(book.title);
            setCover(book.cover ? `${serverUrl}${book.cover}` : '');
        }
    }, [book]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCover(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (window.confirm("Ви впевнені, що хочете оновити цю книгу?")) {
            const updatedData = {
                id: book.id,
                title,
                coverFile: coverFile || book.cover,
                userId: book.UserId,
                description,
            };
            onUpdate(updatedData);
            onClose();
        }
    };

    const handleDelete = () => {
        if (window.confirm("Ви впевнені, що хочете видалити цю книгу?")) {
            onDelete();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal slim">
                <form onSubmit={handleSubmit} className="form-container slim-modal">
                    <h1>Редагувати книгу</h1>
                    <button onClick={onClose} className="close-modal-button">&times;</button>
                    
                    <div className="form-group">
                        <label>Назва:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Обкладинка:</label>
                        {cover && (
                            <img src={cover} alt="Перегляд обкладинки" className="cover-preview" />
                        )}
                        <input id="cover" type="file" onChange={handleFileChange} />
                    </div>
                    
                    <div className="form-group">
                        <label>Опис:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="update-delete">
                        <button type="submit" className="primary-button update-button">
                            Оновити
                        </button>
                        <button type="button" onClick={handleDelete} className="primary-button delete-button">
                            <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }} />
                            Видалити
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;
