import React, { useEffect, useRef } from 'react';
import './SignUp.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import google from '../../Assets/google.svg';
import facebook from '../../Assets/facebook.svg';
import github from '../../Assets/github.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {gapi} from 'gapi-script';

function SignUpPage() {
  const navigate = useNavigate();
  const auth2Ref = useRef(null); // Use useRef to keep track of auth2

  const initialValues = {
    nickname: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    nickname: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(15, 'Username must not exceed 15 characters')
      .required('Username is required.'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Your password is too long')
      .required('Password is required'),
  });

  const onSubmit = (data) => {
    axios.post('http://localhost:3001/users', data)
      .then((response) => {
        console.log('Registration Success:', response.data);
        if (response.data.accessToken && response.data.id) {
          localStorage.setItem('accessToken', response.data.accessToken);
          navigate(`/profile/${response.data.id}`);
        } else {
          alert('No access token received. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Registration Error:', error);
        alert('Registration failed. Please try again.');
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!auth2Ref.current) {
        console.error("Google Auth2 not initialized");
        return; // Prevent execution if auth2 is not ready
      }

      const googleUser = await auth2Ref.current.signIn();
      const id_token = googleUser.getAuthResponse().id_token;

      const response = await axios.post('http://localhost:3001/users/google-signup', { id_token });

      if (response.data.accessToken && response.data.id) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate(`/profile/${response.data.id}`);
      } else {
        alert('Failed to sign in with Google. Please try again.');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      alert('Google Sign-In failed. Please try again.');
    }
  };

  useEffect(() => {
    const initClient = () => {
      gapi.load('client:auth2', () => {
        gapi.auth2.init({
          client_id: '1091135261905-gms21fiehp0gok4ke1r2r23jrtmsoq6g.apps.googleusercontent.com', // Replace with your client ID
        }).then((auth) => {
          auth2Ref.current = auth;
          console.log("Google Auth2 initialized:", auth2Ref.current);
        }).catch((error) => {
          console.error("Failed to initialize Google Auth2:", error);
        });
      });
    };

    const loadGoogleApi = () => {
      gapi.load('client', initClient);
    };

    loadGoogleApi();
  }, []);

  const handleGithubSignIn = () => {
    window.open('http://localhost:3001/users/github', '_self');
  };
  
  
  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2 className="form-title">Sign up with</h2>
        <div className="social-login">
          <button className="social-button" onClick={handleGoogleSignIn}>
            <img src={google} alt="Google" className="social-icon" />
            Google
          </button>
          <button className="social-button">
            <img src={facebook} alt="Facebook" className="social-icon" />
            Facebook
          </button>
          <button className="social-button" onClick={handleGithubSignIn}>
            <img src={github} alt="GitHub" className="social-icon" />
            Github
          </button>
        </div>

        <p className="separator"><span>or</span></p>

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
                placeholder="Nickname"
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
                placeholder="Email"
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
                placeholder="Password"
              />
              <FontAwesomeIcon icon={faLock} />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <button type="submit" className="login-button">Sign Up</button>
          </Form>
        </Formik>

        <p className="signup-text">
          Already have an account? <Link to="/login">Log in!</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
