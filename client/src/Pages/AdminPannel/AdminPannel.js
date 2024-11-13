import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPannel.css';
import Navbar from '../../Components/Navbar/Navbar';

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [updatedBooks, setUpdatedBooks] = useState([]); // Initialize updatedBooks state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBookIds, setExpandedBookIds] = useState(new Set()); // To manage expanded books

  useEffect(() => {
    axios
      .get('http://localhost:3001/books', {
        params: { isAdmin: 'true' }
      })
      .then(response => {
        console.log(response.data);
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setError('Error fetching books');
        setLoading(false);
      });

    // Fetch updated books here
    axios
      .get('http://localhost:3001/updated-books') // Replace with your actual API endpoint
      .then(response => {
        setUpdatedBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching updated books:', error);
      });
  }, []);

  const handleApprove = (bookId) => {
    axios.post(`http://localhost:3001/books/approve/${bookId}`)
      .then(response => {
        alert('Book approved');
        setBooks(books.filter(book => book.id !== bookId));  // Update the UI
      })
      .catch(error => {
        console.error('Error approving book:', error);
        alert('Error approving the book');
      });
  };

  const handleReject = (bookId) => {
    axios.post(`http://localhost:3001/books/reject/${bookId}`)
      .then(response => {
        alert('Book rejected');
        setBooks(books.filter(book => book.id !== bookId));  // Update the UI
      })
      .catch(error => {
        console.error('Error rejecting book:', error);
        alert('Error rejecting the book');
      });
  };

  const toggleDescription = (bookId) => {
    setExpandedBookIds(prevState => {
      const newSet = new Set(prevState);
      if (newSet.has(bookId)) {
        newSet.delete(bookId); // Collapse
      } else {
        newSet.add(bookId); // Expand
      }
      return newSet;
    });
  };

  if (loading) {
    return <p className="loading-text">Loading books...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="admin-panel">
      <Navbar />
      <h1 className="admin-panel-title">Admin Panel</h1>

      {/* Table for Added Books */}
      <h2 style={{ textAlign: 'center', margin: '20px 0px' }}>Додані книжки</h2>
      <table className="books-table">
        <thead>
          <tr className="books-tr">
            <th>Title</th>
            <th>Cover</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Description</th>
            <th>User email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>
                <img
                  className="book-cover"
                  src={book.cover ? `http://localhost:3001/${book.cover}` : null}
                  alt={book.title}
                />
              </td>
              <td>{book.Author?.full_name}</td>
              <td>{book.Genre?.name}</td>
              <td>
                <div className="truncated-text">
                  {book.description.length > 50 && !expandedBookIds.has(book.id)
                    ? `${book.description.substring(0, 50)}...`
                    : book.description}
                </div>
                {book.description.length > 50 && (
                  <span className="show-more" onClick={() => toggleDescription(book.id)}>
                    {expandedBookIds.has(book.id) ? 'Show Less' : 'Show More'}
                  </span>
                )}
              </td>
              <td>{book.User?.email}</td>
              <td>{book.status}</td>
              <td className="admin-button-container">
                <button className="approve-btn" onClick={() => handleApprove(book.id)}>Approve</button>
                <button className="reject-btn" onClick={() => handleReject(book.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table for Updated Books */}
      <h2 style={{ textAlign: 'center', margin: '20px 0px' }}>Оновлені книжки</h2>
      <table className="books-table">
        <thead>
          <tr className="books-tr">
            <th>Title</th>
            <th>Updated Title</th>
            <th>Previous Cover</th>
            <th>Updated Cover</th>
            <th>Previous Description</th>
            <th>Updated Description</th>
            <th>User email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {updatedBooks.map(book => (
            <tr key={book.id}>
              <td>{book.newTitle || book.title}</td>
              <td>
                <img
                  className="book-cover"
                  src={book.previousCover ? `http://localhost:3001/${book.previousCover}` : null}
                  alt="Previous Cover"
                />
              </td>
              <td>
                <img
                  className="book-cover"
                  src={book.updatedCover ? `http://localhost:3001/${book.updatedCover}` : null}
                  alt="Updated Cover"
                />
              </td>
              <td>{book.previousDescription}</td>
              <td>{book.updatedDescription}</td>
              <td className="admin-button-container">
                <button className="approve-btn" onClick={() => handleApprove(book.id)}>Approve</button>
                <button className="reject-btn" onClick={() => handleReject(book.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
