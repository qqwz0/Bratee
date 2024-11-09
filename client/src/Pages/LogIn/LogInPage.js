import React, { useState, useEffect } from 'react'
import './LogInPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import google from '../../Assets/google.svg' 
import facebook from '../../Assets/facebook.svg' 
import github from '../../Assets/github.svg' 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { gapi } from 'gapi-script';

function LogInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  let navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault(); // Prevents page reload

    if (!email || !password) {
      setErrorMessage('Please fill in both fields.');
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/users/login", {
        email: email,
        password: password,
      });

      if (response.data.error) {
        alert(response.data.error);
      } else {
        const {accessToken, id} = response.data;
        localStorage.setItem('accessToken', accessToken);
        navigate(`/profile/${id}`);
      }
    } catch (error) {
      alert('Login failed.');
      setErrorMessage('Invalid email or password.');
    }
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: '1091135261905-gms21fiehp0gok4ke1r2r23jrtmsoq6g.apps.googleusercontent.com', // Replace with your client ID
        scope: 'profile email'
      });
    };

    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: '1091135261905-gms21fiehp0gok4ke1r2r23jrtmsoq6g.apps.googleusercontent.com', // Replace with your client ID
      }).then(() => {
        console.log('GAPI client initialized.');
      }).catch((error) => {
        console.error('Error initializing GAPI client:', error);
      });
    });
  }, []);

  const handleGoogleLogin = () => {
    const auth = gapi.auth2.getAuthInstance();
    if (!auth) {
      console.error('Google Auth instance is not initialized.');
      return;
    }
    
    auth.signIn().then((googleUser) => {
      const id_token = googleUser.getAuthResponse().id_token;

      // Send ID token to your backend for verification and to create a session
      axios.post('http://localhost:3001/users/google-login', { id_token })
        .then((response) => {
          const { accessToken, id } = response.data;
          localStorage.setItem('accessToken', accessToken);
          navigate(`/profile/${id}`);
        })
        .catch((error) => {
          console.error('Google login error:', error);
          alert('Login failed.');
        });
    }).catch((error) => {
      console.error('Google Sign-In error:', error);
      alert('Google sign-in failed.');
    });
  };


  return (
    <div className='login-page-wrapper'>
      <div className='login-container'>
        <h2 className='form-title'>Log in with</h2>
        <div className='social-login'>
          <button className='social-button' onClick={handleGoogleLogin}>
            <img src={google} alt ="Google" className='social-icon'/>
            Google
          </button>
          <button className='social-button'>
            <img src={facebook} alt ="Facebook" className='social-icon'/>
            Facebook
          </button>
          <button className='social-button'>
            <img src={github} alt ="GitHub" className='social-icon'/>
            Github
          </button>
        </div>

        <p className='separator'><span>or</span></p>

            <form className='login-form'>
            <div className='input-wrapper'>
              <input type='email' className='input-field' placeholder='Email' onChange={(event) => {setEmail(event.target.value);}}/>
              <FontAwesomeIcon icon={faEnvelope} />
          
            </div>
            <div className='input-wrapper'>
              <input type='password' className='input-field' placeholder='Password' onChange={(event) => {setPassword(event.target.value);}} />
              <FontAwesomeIcon icon={faLock} />
            </div>
            <a href="#" className='forgot-pass-link'>Forgot password?</a>
            
            <button className='login-button' onClick={login}>Log In</button>
            </form>

        <p className='signup-text'>Don't have an account? <Link to='/signup'>Sign up!</Link></p>

      </div>
    </div>
  );
}

export default LogInPage