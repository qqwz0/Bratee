import React, { useState } from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Link, useNavigate } from 'react-router-dom';
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
    console.log('Decoded Token:', decoded); // Log the decoded token to inspect

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

  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
    },
    {
      text: "About",
      icon: <InfoIcon />,
    },
    {
      text: "Testimonials",
      icon: <CommentRoundedIcon />,
    },
    {
      text: "Contact",
      icon: <PhoneRoundedIcon />,
    },
    {
      text: "Cart",
      icon: <ShoppingCartRoundedIcon />,
    },
  ];


  return (
    <nav>
      <div className="nav-logo-container">
        BRate
      </div>
      <div className="navbar-links-container">
        <Link to='/'>Home</Link>
        <Link to='/search'>Search</Link>
        {/* <Link to='/createbook'>Add a book</Link> */}
        {/* Conditional rendering based on accessToken */}
        {accessToken ? (
          <>
          <Link to={`/profile/${userId}`}>My profile</Link>
          <button onClick={handleLogOut} className="primary-button">Log out</button>
          </>
        ) : (
          <>
          <Link to='/login' className="primary-button no-hover" id="login-button">Log in</Link>
          <span style={{ margin: '0', marginRight: '1rem' }}>or</span>
          <Link to='/signup' className="primary-button no-hover" id="signup-button">SignUp</Link>
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
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;