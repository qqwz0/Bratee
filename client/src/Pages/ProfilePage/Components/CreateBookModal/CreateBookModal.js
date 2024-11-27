import React, { useState } from 'react';
import Modal from 'react-modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './CreateBookModal.css';

Modal.setAppElement('#root');

function CreateBook({ isOpen, onClose, onAddBook }) {
    const [notification, setNotification] = useState(''); // Стан для сповіщення

    const initialValues = {
        title: '',
        AuthorId: '',
        GenreId: '',
        description: '',
        cover: null, // Для завантаження файлу
    };

    const ValidationSchema = Yup.object().shape({
        title: Yup.string().required('Назва книги є обов\'язковою'),
        AuthorId: Yup.string().required('Ім\'я автора є обов\'язковим'),
        GenreId: Yup.string().required('Жанр є обов\'язковим'),
        description: Yup.string().required('Опис книги є обов\'язковим').max(2000, 'Опис не може перевищувати 2000 символів'),
        cover: Yup.mixed().required('Обкладинка книги є обов\'язковою'),
    });

    const onSubmit = async (data, { resetForm, setFieldError }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            
            const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (data.cover && !allowedFileTypes.includes(data.cover.type)) {
                setFieldError("cover", "Будь ласка, завантажте правильний формат (jpeg, jpg, png, gif).");
                return;
            }
    
            // Отримання або створення автора
            let authorResponse = await axios.get(`${process.env.REACT_APP_API_URL}/authors`, {
                headers: { accessToken }
            });
            let authorId;
            
            // Check if AuthorId is provided before calling .toLowerCase()
            if (data.AuthorId && data.AuthorId.trim()) {
                const existingAuthor = authorResponse.data.find(
                    author => author.full_name.toLowerCase() === data.AuthorId.toLowerCase()
                );
    
                if (existingAuthor) {
                    authorId = existingAuthor.id;
                } else {
                    const newAuthorResponse = await axios.post(`${process.env.REACT_APP_API_URL}/authors`, { full_name: data.AuthorId });
                    authorId = newAuthorResponse.data.id;
                }
            } else {
                setFieldError("AuthorId", "Ім'я автора є обов'язковим");
                return;
            }
    
            // Отримання або створення жанру
            let genreResponse = await axios.get(`${process.env.REACT_APP_API_URL}/genres`, {
                headers: { accessToken }
            });
            let genreId;
            
            // Check if GenreId is provided before calling .toLowerCase()
            if (data.GenreId && data.GenreId.trim()) {
                const existingGenre = genreResponse.data.find(
                    genre => genre.name.toLowerCase() === data.GenreId.toLowerCase()
                );
    
                if (existingGenre) {
                    genreId = existingGenre.id;
                } else {
                    const newGenreResponse = await axios.post(`${process.env.REACT_APP_API_URL}/genres`, { name: data.GenreId });
                    genreId = newGenreResponse.data.id;
                }
            } else {
                setFieldError("GenreId", "Жанр є обов'язковим");
                return;
            }
    
            // Підготовка даних форми з обкладинкою
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('AuthorId', authorId);
            formData.append('GenreId', genreId);
            formData.append('cover', data.cover); // Додаємо обкладинку
    
            // Надсилання даних на сервер
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/books`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', accessToken },
            });
            
            const newBook = response.data;
            newBook.Author = { full_name: data.AuthorId };
            newBook.CreatedAt = new Date().toISOString();
    
            onAddBook(newBook);
    
            setNotification('Книга успішно завантажена!'); // Сповіщення про успіх
            resetForm(); // Очищення полів форми
    
        } catch (err) {
            if (err.response) {
                // Якщо є відповідь від сервера, показуємо повідомлення про помилку
                const errorMessage = err.response.data.message || 'Помилка при завантаженні книги. Спробуйте ще раз.';
                setNotification(errorMessage);
                
                // Специфічна помилка для обкладинки
                if (errorMessage.toLowerCase().includes('cover')) {
                    setFieldError("cover", "Помилка при завантаженні обкладинки. Спробуйте ще раз.");
                }
            } else {
                // Якщо немає відповіді, використовуємо загальне повідомлення
                setNotification('Помилка при завантаженні книги. Спробуйте ще раз.');
            }
            console.error("Помилка при завантаженні книги:", err);
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
                        <h1>Додати книгу</h1>
                        <button onClick={onClose} className="close-modal-button">
                          &times;
                        </button>

                        <div className="form-group">
                            <label htmlFor="title">Введіть назву книги</label>
                            <Field
                                id="inputCreatePost"
                                name="title"
                                placeholder="Назва книги"
                                className="form-field"
                            />
                            <ErrorMessage name="title" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cover">Завантажити обкладинку книги</label>
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
                            <label htmlFor="author">Введіть повне ім'я автора книги</label>
                            <Field
                                id="inputCreatePost"
                                name="AuthorId"
                                placeholder="Автор книги"
                                className="form-field"
                            />
                            <ErrorMessage name="AuthorId" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="genre">Введіть жанр книги</label>
                            <Field
                                id="inputCreatePost"
                                name="GenreId"
                                placeholder="Жанр книги"
                                className="form-field"
                            />
                            <ErrorMessage name="GenreId" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Введіть опис книги</label>
                            <Field
                                id="inputCreatePost"
                                name="description"
                                as="textarea"
                                placeholder="Опис книги"
                                className="form-field"
                            />
                            <ErrorMessage name="description" component="div" className="error-message" />
                        </div>

                        <button type="submit" className="submit-button">
                            Надіслати
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
