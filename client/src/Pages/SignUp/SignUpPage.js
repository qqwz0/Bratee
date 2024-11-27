import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gapi } from 'gapi-script';
import api from '../../axiosInstance'
import google from '../../Assets/google.svg';


function SignUpPage() {
  const navigate = useNavigate();
  const auth2Ref = useRef(null);

  const initialValues = {
    nickname: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    nickname: Yup.string()
      .min(3, 'Імʼя користувача має містити як мінімум 3 символи')
      .max(15, 'Імʼя користувача має містити не більше 15 символів')
      .required('Імʼя користувача є обовʼязковим полем'),
    email: Yup.string()
      .email('Невірний формат електронної пошти')
      .required('Електронна пошта є обовʼязковим полем'),
    password: Yup.string()
      .min(6, 'Пароль має містити як мінімум 6 символів')
      .max(20, 'Пароль має містити не більше 20 символів')
      .required('Пароль є обовʼязковим полем'),
  });

  const onSubmit = (data) => {
    axios.post(`${process.env.REACT_APP_API_URL}/users`, data)
      .then((response) => {
        console.log('Успішна реєстрація:', response.data);
        if (response.data.accessToken && response.data.id) {
          localStorage.setItem('accessToken', response.data.accessToken);
          navigate(`/profile/${response.data.id}`);
        } else {
          alert('Не отримано токен доступу. Спробуйте ще раз.');
        }
      })
      .catch((error) => {
        console.error('Помилка реєстрації:', error);
        alert('Реєстрація не вдалася. Спробуйте ще раз.');
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!auth2Ref.current) {
        console.error("Google Auth2 не ініціалізовано");
        return;
      }

      const googleUser = await auth2Ref.current.signIn();
      const id_token = googleUser.getAuthResponse().id_token;

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/google-signup`, { id_token });

      if (response.data.accessToken && response.data.id) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate(`/profile/${response.data.id}`);
      } else {
        alert('Не вдалося увійти через Google. Спробуйте ще раз.');
      }
    } catch (error) {
      console.error('Помилка входу через Google:', error);
      alert('Вхід через Google не вдався. Спробуйте ще раз.');
    }
  };

  useEffect(() => {
    const initClient = () => {
      gapi.load('client:auth2', () => {
        gapi.auth2.init({
          client_id: '1091135261905-gms21fiehp0gok4ke1r2r23jrtmsoq6g.apps.googleusercontent.com',
        }).then((auth) => {
          auth2Ref.current = auth;
          console.log("Google Auth2 ініціалізовано:", auth2Ref.current);
        }).catch((error) => {
          console.error("Помилка ініціалізації Google Auth2:", error);
        });
      });
    };

    const loadGoogleApi = () => {
      gapi.load('client', initClient);
    };

    loadGoogleApi();
  }, []);

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2 className="form-title">Реєстрація через</h2>
        <div className="social-login">
          <button className="social-button" onClick={handleGoogleSignIn}>
            <img src={google} alt="Google" className="social-icon" />
            Google
          </button>
        </div>

        <p className="separator"><span>або</span></p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="login-form">
            <div className="input-wrapper">
              <Field
                type="text"
                id="nickname"
                name="nickname"
                className="input-field"
                placeholder="Імʼя користувача"
              />
              <FontAwesomeIcon icon={faUser} />
              <ErrorMessage name="nickname" component="div" className="error-message" />
            </div>

            <div className="input-wrapper">
              <Field
                type="email"
                id="email"
                name="email"
                className="input-field"
                placeholder="Електронна пошта"
              />
              <FontAwesomeIcon icon={faEnvelope} />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="input-wrapper">
              <Field
                type="password"
                id="password"
                name="password"
                className="input-field"
                placeholder="Пароль"
              />
              <FontAwesomeIcon icon={faLock} />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <button type="submit" className="login-button">Зареєструватися</button>
          </Form>
        </Formik>

        <p className="signup-text">
          Вже маєте обліковий запис? <Link to="/login">Увійти!</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
