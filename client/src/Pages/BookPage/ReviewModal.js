import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './ReviewModal.css'; // Ensure this path is correct based on your file structure

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState('');

  // Star rating component
  const StarRating = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${rating >= star ? 'filled' : ''}`}
            onClick={() => setRating(star)}
            role="button"
            tabIndex="0"
            onKeyPress={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <Formik
          initialValues={{ review_text: '' }}
          validate={values => {
            const errors = {};
            if (!rating) {
              errors.rating = 'Required';
            }
            if (!values.review_text) {
              errors.review_text = 'Required';
            }
            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            onSubmit({ rating, review_text: values.review_text }); // Include rating in submission
            resetForm();
            setRating(''); // Reset rating after submission
            onClose(); // Close the modal after submission
          }}
        >
          {({ isSubmitting }) => (
            <Form className="form-container">
              <h1>Додати відгук</h1>
              <button onClick={onClose} className="close-modal-button">&times;</button>

              {/* StarRating Component */}
              <div className="form-group">
                <label>Рейтинг (1-5):</label>
                <StarRating />
                <ErrorMessage name="rating" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="review_text">Текст відгуку:</label>
                <Field as="textarea" name="review_text" id="review_text" />
                <ErrorMessage name="review_text" component="div" className="error-message" />
              </div>

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                Надіслати
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReviewModal;
