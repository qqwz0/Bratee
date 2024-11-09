import React, { useState, useEffect } from 'react';
import './ChangeBookModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const BookModal = ({ isOpen, onClose, book, onUpdate, onDelete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState('');
    const [coverFile, setCoverFile] = useState(null);

    const serverUrl = 'http://localhost:3001/';

    useEffect(() => {
        if (book) {
            setTitle(book.title);
            setDescription(book.description);
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
        if (window.confirm("Are you sure you want to update this book?")) {
            const updatedData = {
                id: book.id,
                title,
                description,
                coverFile,
            };
            onUpdate(updatedData);
            onClose();
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            onDelete();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal slim">
                <form onSubmit={handleSubmit} className="form-container slim-modal">
                    <h1>Edit Book</h1>
                    <button onClick={onClose} className="close-modal-button">&times;</button>
                    
                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Cover Image:</label>
                        {cover && (
                            <img src={cover} alt="Cover Preview" className="cover-preview" />
                        )}
                        <input id='cover' type="file" onChange={handleFileChange} />
                    </div>
                    
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className='update-delete'>
                        <button type="submit" className='primary-button update-button'>Update</button>
                        <button type="button" onClick={handleDelete} className='primary-button delete-button'>
                            <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }}/>Delete book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;
