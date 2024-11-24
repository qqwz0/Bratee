import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPannel.css';
import Navbar from '../../Components/Navbar/Navbar';
import { getUserId } from '../../Components/Navbar/Navbar';

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [updatedBooks, setUpdatedBooks] = useState([]); // Ініціалізація стану для оновлених книжок
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBookIds, setExpandedBookIds] = useState(new Set()); // Для управління розкритими книжками
  const [, setIsAdmin] = useState(false); // Стан для відстеження, чи є користувач адміністратором
  const navigate = useNavigate();

  const userId = getUserId();

  useEffect(() => {
    // Перевірка, чи є користувач адміністратором
    axios.get(`http://localhost:3001/users/admin/${userId}`)
      .then(response => {
        if (response.status === 403) {
          alert('Доступ заборонено');
          navigate.push('/'); // Перехід на домашню сторінку або іншу сторінку, якщо користувач не адміністратор
        } else {
          setIsAdmin(true); // Користувач є адміністратором
          fetchBooks();
          fetchUpdatedBooks();
        }
      })
      .catch(error => {
        console.error('Сторінка не знайдена', error);
        setError('Сторінка не знайдена');
        setLoading(false);
      });
  }, [userId, navigate]); // Додаємо userId і navigate в залежності

  const fetchBooks = () => {
    axios
      .get('http://localhost:3001/books', {
        params: { isAdmin: 'true' }
      })
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Помилка при завантаженні книжок:', error);
        setError('Помилка при завантаженні книжок');
        setLoading(false);
      });
  };

  const fetchUpdatedBooks = () => {
    axios
      .get('http://localhost:3001/books/updated-books')
      .then(response => {
        setUpdatedBooks(response.data);
      })
      .catch(error => {
        console.error('Помилка при завантаженні оновлених книжок:', error);
      });
  };

  const handleApprove = (bookId) => {
    axios.post(`http://localhost:3001/books/approve/${bookId}`)
      .then(response => {
        alert('Книжка схвалена');
        setBooks(books.filter(book => book.id !== bookId));  // Оновлення UI
      })
      .catch(error => {
        console.error('Помилка при схваленні книжки:', error);
        alert('Помилка при схваленні книжки');
      });
  };

  const handleApproveUpdate = (bookId) => {
    console.log("Схвалення оновлення для книжки з ID:", bookId);
    axios
      .put(`http://localhost:3001/books/approve-update/${bookId}`)
      .then(response => {
        alert('Оновлення схвалене');
        setUpdatedBooks(updatedBooks.filter(book => book.updatedBookData.id !== bookId));
      })
      .catch(error => {
        console.error('Помилка при схваленні оновлення:', error);
        alert('Помилка при схваленні оновлення');
      });
  };

  const handleReject = (bookId) => {
    axios.post(`http://localhost:3001/books/reject/${bookId}`)
      .then(response => {
        alert('Книжка відхилена');
        setBooks(books.filter(book => book.id !== bookId));  // Оновлення UI
      })
      .catch(error => {
        console.error('Помилка при відхиленні книжки:', error);
        alert('Помилка при відхиленні книжки');
      });
  };

  const handleRejectUpdate = (bookId) => {
    console.log("Відхилення оновлення для книжки з ID:", bookId);
    axios
      .delete(`http://localhost:3001/books/reject-update/${bookId}`)
      .then(response => {
        alert('Оновлення відхилене');
        setUpdatedBooks(updatedBooks.filter(book => book.updatedBookData.id !== bookId));
      })
      .catch(error => {
        console.error('Помилка при відхиленні оновлення:', error);
        alert('Помилка при відхиленні оновлення');
      });
  };

  const toggleDescription = (bookId) => {
    setExpandedBookIds(prevState => {
      const newSet = new Set(prevState);
      if (newSet.has(bookId)) {
        newSet.delete(bookId); // Згорнути
      } else {
        newSet.add(bookId); // Розгорнути
      }
      return newSet;
    });
  };

  if (loading) {
    return <p className="loading-text">Завантаження книжок...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="admin-panel">
      <Navbar />
      <h1 className="admin-panel-title">Адміністративна панель</h1>

      {/* Таблиця для доданих книжок */}
      <h2 style={{ textAlign: 'center', margin: '20px 0px' }}>Додані книжки</h2>
      <table className="books-table">
        <thead>
          <tr className="books-tr">
            <th>Назва</th>
            <th>Обкладинка</th>
            <th>Автор</th>
            <th>Жанр</th>
            <th>Опис</th>
            <th>Email користувача</th>
            <th>Статус</th>
            <th>Дії</th>
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
                    {expandedBookIds.has(book.id) ? 'Показати менше' : 'Показати більше'}
                  </span>
                )}
              </td>
              <td>{book.User?.email}</td>
              <td>{book.status}</td>
              <td className="admin-button-container">
                <button className="approve-btn" onClick={() => handleApprove(book.id)}>Схвалити</button>
                <button className="reject-btn" onClick={() => handleReject(book.id)}>Відхилити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Таблиця для оновлених книжок */}
      <h2 style={{ textAlign: 'center', margin: '20px 0px' }}>Оновлені книжки</h2>
      <table className="books-table">
        <thead>
          <tr className="books-tr">
            <th>Оригінальна назва</th>
            <th>Оновлена назва</th>
            <th>Оригінальна обкладинка</th>
            <th>Оновлена обкладинка</th>
            <th>Оригінальний опис</th>
            <th>Оновлений опис</th>
            <th>Email користувача</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {updatedBooks.map((book, index) => (
            <tr key={index}>
              <td>{book.originalBookData?.title}</td>
              <td>{book.updatedBookData?.title}</td>
              <td>
                <img
                  className="book-cover"
                  src={book.originalBookData?.cover ? `http://localhost:3001/${book.originalBookData.cover}` : null}
                  alt="Оригінальна обкладинка"
                />
              </td>
              <td>
                <img
                  className="book-cover"
                  src={book.updatedBookData?.cover ? `http://localhost:3001/${book.updatedBookData.cover}` : null}
                  alt="Оновлена обкладинка"
                />
              </td>
              <td>{book.originalBookData?.description}</td>
              <td>{book.updatedBookData?.description}</td>
              <td>{book.User?.email}</td>
              <td>
                <button className="approve-btn" onClick={() => handleApproveUpdate(book.updatedBookData?.id)}>
                  Схвалити
                </button>
                <button className="reject-btn" onClick={() => handleRejectUpdate(book.updatedBookData?.id)}>
                  Відхилити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
