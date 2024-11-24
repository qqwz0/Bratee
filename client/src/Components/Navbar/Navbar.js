import React, { useState } from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import { Link, useNavigate, } from 'react-router-dom';
import './Navbar.css';
import {jwtDecode} from 'jwt-decode';

export const getUserId = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.warn('No access token found');
    return null; // Early return if no token found
  }

  try {
    const decoded = jwtDecode(token);

    // Adjust this if your ID is nested inside another object
    const userId = decoded.id || decoded.userId || decoded.user?.id;
    if (!userId) {
      console.error('No user ID found in the token');
    }
    return userId;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null; // Return null if decoding fails
  }
};

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const userId = getUserId();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <nav>
      <div className="nav-logo-container">
        BRate
      </div>
      <div className="navbar-links-container">
        <Link to='/'>Головна</Link>
        <Link to='/search'>Книги</Link>
        {/* Conditional rendering based on accessToken */}
        {accessToken ? (
          <>
          <Link to={`/profile/${userId}/collections`}>Моя сторінка</Link>
          <button onClick={handleLogOut} className="primary-button">Вийти</button>
          </>
        ) : (
          <>
          <Link to='/login' className="primary-button no-hover" id="login-button">Увійти</Link>
          <span style={{ margin: '0', marginRight: '1rem' }}>or</span>
          <Link to='/signup' className="primary-button no-hover" id="signup-button">Зареєструватись</Link>
          </>
        )}
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;