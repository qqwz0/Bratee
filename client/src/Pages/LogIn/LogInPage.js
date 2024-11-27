import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gapi } from 'gapi-script';

import './LogInPage.css';
import googleIcon from '../../Assets/google.svg';

function LogInPage() {
  // Стан
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Авторизація
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Будь ласка, заповніть обидва поля.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
      if (response.data.error) {
        alert(response.data.error);
      } else {
        const { accessToken, id } = response.data;
        localStorage.setItem('accessToken', accessToken);
        navigate(`/profile/${id}`);
      }
    } catch (error) {
      alert('Помилка входу.');
      setErrorMessage('Неправильна електронна адреса або пароль.');
    }
  };

  // Ініціалізація Google API
  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: '1091135261905-gms21fiehp0gok4ke1r2r23jrtmsoq6g.apps.googleusercontent.com', // Замініть своїм ID
      })
        .then(() => console.log('GAPI клієнт ініціалізовано.'))
        .catch((error) => console.error('Помилка ініціалізації GAPI клієнта:', error));
    });
  }, []);

  // Авторизація через Google
  const handleGoogleLogin = () => {
    const auth = gapi.auth2.getAuthInstance();
    if (!auth) {
      console.error('Google Auth інстанс не ініціалізований.');
      return;
    }

    auth.signIn().then((googleUser) => {
      const id_token = googleUser.getAuthResponse().id_token;
      axios.post(`${process.env.REACT_APP_API_URL}/users/google-login`, { id_token })
        .then((response) => {
          const { accessToken, id } = response.data;
          localStorage.setItem('accessToken', accessToken);
          navigate(`/profile/${id}`);
        })
        .catch((error) => {
          console.error('Помилка входу через Google:', error);
          alert('Помилка входу.');
        });
    }).catch((error) => {
      console.error('Помилка входу через Google:', error);
      alert('Помилка входу через Google.');
    });
  };

  // Інтерфейс
  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2 className="form-title">Увійти через</h2>
        <div className="social-login">
          <button className="social-button" onClick={handleGoogleLogin}>
            <img src={googleIcon} alt="Google" className="social-icon" />
            Google
          </button>
        </div>

        <p className="separator"><span>або</span></p>

        <form className="login-form">
          <div className="input-wrapper">
            <input
              type="email"
              className="input-field"
              placeholder="Електронна пошта"
              onChange={(e) => setEmail(e.target.value)}
            />
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              className="input-field"
              placeholder="Пароль"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon icon={faLock} />
          </div>
          <button className="login-button" onClick={handleLogin}>Увійти</button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p className="signup-text">
          Ще не маєте акаунту? <Link to="/signup">Зареєструйтесь!</Link>
        </p>
      </div>
    </div>
  );
}

export default LogInPage;
