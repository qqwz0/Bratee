import React from 'react';
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

function SignUpPage() {
  const navigate = useNavigate();

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
            console.log('Registration Success:', response.data); // Log the entire response

            // Check if accessToken exists in the response
            if (response.data.accessToken && response.data.id) {
                // Store the access token in localStorage
                sessionStorage.setItem('accessToken', response.data.accessToken);
                // Navigate to the profile page
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

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2 className="form-title">Sign up with</h2>
        <div className="social-login">
          <button className="social-button">
            <img src={google} alt="Google" className="social-icon" />
            Google
          </button>
          <button className="social-button">
            <img src={facebook} alt="Facebook" className="social-icon" />
            Facebook
          </button>
          <button className="social-button">
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
