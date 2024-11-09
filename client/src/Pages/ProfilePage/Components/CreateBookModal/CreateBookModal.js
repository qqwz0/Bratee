import React, { useState } from 'react';
import Modal from 'react-modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './CreateBookModal.css';

Modal.setAppElement('#root');

function CreateBook({ isOpen, onClose, onAddBook }) {
    const [notification, setNotification] = useState(''); // State for notification

    const initialValues = {
        title: '',
        AuthorId: '',
        GenreId: '',
        description: '',
        cover: null, // For the file upload
    };

    const ValidationSchema = Yup.object().shape({
        title: Yup.string().required('Book title is required'),
        AuthorId: Yup.string().required('Author name is required'),
        GenreId: Yup.string().required('Genre is required'),
        description: Yup.string().required('Book description is required').max(2000, 'Description can\'t exceed 2000 characters'),
        cover: Yup.mixed().required('Cover image is required'),
    });

    const onSubmit = async (data, { resetForm, setFieldError }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            
            const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (data.cover && !allowedFileTypes.includes(data.cover.type)) {
                setFieldError("cover", "Будь ласка, завантажте правильний формат (jpeg, jpg, png, gif).");
                return;
            }

            // Handling author creation or fetching
            let authorResponse = await axios.get("http://localhost:3001/authors", {
                headers: { accessToken }
            });
            let authorId;
            const existingAuthor = authorResponse.data.find(
                author => author.full_name.toLowerCase() === data.AuthorId.toLowerCase()
            );

            if (existingAuthor) {
                authorId = existingAuthor.id;
            } else {
                const newAuthorResponse = await axios.post("http://localhost:3001/authors", { full_name: data.AuthorId });
                authorId = newAuthorResponse.data.id;
            }

            // Handling genre creation or fetching
            let genreResponse = await axios.get("http://localhost:3001/genres");
            let genreId;
            const existingGenre = genreResponse.data.find(
                genre => genre.name.toLowerCase() === data.GenreId.toLowerCase()
            );

            if (existingGenre) {
                genreId = existingGenre.id;
            } else {
                const newGenreResponse = await axios.post("http://localhost:3001/genres", { name: data.GenreId });
                genreId = newGenreResponse.data.id;
            }

            // Prepare form data with the cover image
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('AuthorId', authorId);
            formData.append('GenreId', genreId);
            formData.append('cover', data.cover); // Add the cover image

            // Send the form data to the server
            const response = await axios.post("http://localhost:3001/books", formData, {
                headers: { 'Content-Type': 'multipart/form-data', accessToken },
            });
            
            const newBook = response.data;
            newBook.Author = { full_name: data.AuthorId };
            newBook.CreatedAt = new Date().toISOString();

            onAddBook(newBook);

            setNotification('Book uploaded successfully!'); // Set success message
            resetForm(); // Clear the form fields

        } catch (err) {
            if (err.response) {
                // If there is a response from the server, show the error message
                const errorMessage = err.response.data.message || 'Error uploading the book. Please try again.';
                setNotification(errorMessage);
                
                // Specific field error for cover
                if (errorMessage.toLowerCase().includes('cover')) {
                    setFieldError("cover", "Error uploading the cover image. Please try again.");
                }
            } else {
                // If there is no response, use a generic message
                setNotification('Error uploading the book. Please try again.');
            }
            console.error("Error uploading the book:", err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal"
            overlayClassName="modal-overlay"
        >
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={ValidationSchema}
            >
                {({ setFieldValue }) => (
                    <Form className="form-container">
                        <h1>Add a book</h1>
                        <button onClick={onClose} className="close-modal-button">
                          &times;
                        </button>

                        <div className="form-group">
                            <label htmlFor="title">Enter book title</label>
                            <Field
                                id="inputCreatePost"
                                name="title"
                                placeholder="Book title"
                                className="form-field"
                            />
                            <ErrorMessage name="title" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cover">Upload book cover</label>
                            <input
                                id="cover"
                                name="cover"
                                type="file"
                                className="form-field"
                                onChange={(event) => {
                                    setFieldValue("cover", event.currentTarget.files[0]);
                                }}
                            />
                            <ErrorMessage name="cover" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="author">Enter book author’s full name</label>
                            <Field
                                id="inputCreatePost"
                                name="AuthorId"
                                placeholder="Book author"
                                className="form-field"
                            />
                            <ErrorMessage name="AuthorId" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="genre">Enter book genre</label>
                            <Field
                                id="inputCreatePost"
                                name="GenreId"
                                placeholder="Book genre"
                                className="form-field"
                            />
                            <ErrorMessage name="GenreId" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Enter book description</label>
                            <Field
                                id="inputCreatePost"
                                name="description"
                                as="textarea"
                                placeholder="Book description"
                                className="form-field"
                            />
                            <ErrorMessage name="description" component="div" className="error-message" />
                        </div>

                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>

            {notification && (
                <div className="notification-popup">
                    {notification}
                    <button onClick={() => setNotification('')} className="close-notification-button">X</button>
                </div>
            )}
        </Modal>
    );
}

export default CreateBook;
