import React, { useState, useEffect } from 'react';
import './ChangeBookModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const BookModal = ({ isOpen, onClose, book, onUpdate, onDelete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState('');
    const [coverFile, setCoverFile] = useState(null); // Holds the uploaded file

    // Base URL for images stored on the server
    const serverUrl = 'http://localhost:3001/';
    

    useEffect(() => {
        if (book) {
            setTitle(book.title);
            setDescription(book.description);
            setCover(book.cover ? `${serverUrl}${book.cover}` : ''); // Prepend server URL to cover path
        }
    }, [book]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCover(URL.createObjectURL(file)); // This shows the preview of the new cover image immediately
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {
            id: book.id,
            title,
            description,
            coverFile,
        };
        console.log("Data to update:", updatedData);
        onUpdate(updatedData); // This will call the updated handleUpdate function in ListItem
        onClose();
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
                        <button type="button" onClick={onDelete} className='primary-button delete-button'><FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }}/>Delete book</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookModal;
