import React, { useState } from 'react';
import Modal from 'react-modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './CreateBook.css';
import Navbar from '../../Components/Navbar/Navbar';
import * as Yup from 'yup';
import axios from "axios";

Modal.setAppElement('#root');

function CreateBook() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    const initialValues = {
        title: '',
        AuthorId: '',
        GenreId: '',
        description: '' 
    }

    const ValidationSchema = Yup.object().shape({
        title: Yup.string().required('Book title is required'),
        AuthorId: Yup.string().required('Author name is required'),
        GenreId: Yup.string().required('Genre is required'),
        description: Yup.string().required('Book description is required').max(2000, 'Description can\'t exceed 2000 characters')
    });

    const onSubmit = async (data) => {
      try {
          // Fetch authors to find or create an author
          let authorResponse = await axios.get("http://localhost:3001/authors");
          let authorId;
          const existingAuthor = authorResponse.data.find(author => author.full_name.toLowerCase() === data.AuthorId.toLowerCase());
  
          if (existingAuthor) {
              authorId = existingAuthor.id;
          } else {
              const newAuthorResponse = await axios.post("http://localhost:3001/authors", { full_name: data.AuthorId });
              console.log('New author response:', newAuthorResponse.data); // Log the response
              authorId = newAuthorResponse.data.id; // Ensure you get the ID from the new author
          }
  
          // Fetch genres to find or create a genre
          let genreResponse = await axios.get("http://localhost:3001/genres");
          let genreId;
          const existingGenre = genreResponse.data.find(genre => genre.name.toLowerCase() === data.GenreId.toLowerCase());
  
          if (existingGenre) {
              genreId = existingGenre.id;
          } else {
              const newGenreResponse = await axios.post("http://localhost:3001/genres", { name: data.GenreId });
              console.log('New genre response:', newGenreResponse.data); // Log the response
              genreId = newGenreResponse.data.id; // Ensure you get the ID from the new genre
          }
  
          // Log the authorId and genreId for debugging
          console.log('Author ID:', authorId);
          console.log('Genre ID:', genreId);
  
          // Check if both IDs were obtained
          if (!authorId || !genreId) {
              console.error('Missing author or genre ID');
              return;
          }
  
          // Prepare the book data and submit
          const bookData = {
              title: data.title,
              description: data.description,
              AuthorId: authorId,
              GenreId: genreId
          };
  
          await axios.post("http://localhost:3001/books", bookData);
          console.log('Book uploaded successfully!');
  
      } catch (err) {
          console.error("Error uploading the book:", err);
      }
  };
  return (
    <div className="create-book-container">
        <Navbar />
      {/* Button to trigger the modal */}
      <button onClick={() => setModalIsOpen(true)} className="open-modal-button">
        Add a Book
      </button>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={ValidationSchema}
        >
          <Form className="form-container">
            <h1>Add a book</h1>

            {/* Book Title */}
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

            {/* Author */}
            <div className="form-group">
              <label htmlFor="author">Enter book author’s full name</label>
              <Field
                id="inputCreatePost"
                name="AuthorId"
                placeholder="Book author"
                className="form-field"
              />
              <ErrorMessage name="author" component="div" className="error-message" />
            </div>

            {/* Genre */}
            <div className="form-group">
              <label htmlFor="genre">Enter book genre</label>
              <Field
                id="inputCreatePost"
                name="GenreId"
                placeholder="Book genre"
                className="form-field"
              />
              <ErrorMessage name="genre" component="div" className="error-message" />
            </div>

            {/* Description */}
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

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              Submit
            </button>
          </Form>
        </Formik>

        {/* Close button */}
        <button onClick={() => setModalIsOpen(false)} className="close-modal-button">
          Close
        </button>
      </Modal>
    </div>
  );
}

export default CreateBook;