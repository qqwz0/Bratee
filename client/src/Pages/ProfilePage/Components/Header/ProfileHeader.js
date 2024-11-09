import React, { useState, useEffect } from 'react';
import './ProfileHeader.css';
import {Link} from 'react-router-dom';
import { getUserId } from '../../../../Components/Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UserInfoModal = ({ isOpen, onClose, user, onUpdate, onDelete, userId, accessToken }) => {
  const [nickname, setNickname] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const serverUrl = 'http://localhost:3001/';

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setProfilePicture(user.profilePicture ? `${serverUrl}${user.profilePicture}` : '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
    setProfilePictureFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nickname', nickname);

    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    } else if (profilePicture) {
      formData.append('profilePicture', profilePicture)
    }

    console.log(formData);

    try {
      const response = await axios.put(`http://localhost:3001/users/${userId}`, formData, {
        headers: {
          accessToken
        },
      });

      if (response.status === 200) {
        console.log('Updated info:', response.data.user);
        onUpdate({
          nickname: response.data.user.nickname,
          profilePicture: response.data.user.profilePicture,
        });  // Update parent state with new user data
        onClose();  // Close the modal
      } else {
        console.error('Update failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error while updating:', error);
    }
  };
  
  const handleSave = async (formData) => {
    try {
      const response = await axios.put(`http://localhost:3001/users/${userId}`, formData, {
        headers: 
         {accessToken}, // Include access token if required
      });
  
      if (response.status === 200) {
        console.log('Updated info:', response.data.user); // Display the updated data or update state accordingly
      } else {
        console.error('Update failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error while updating:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal slim">
        <form onSubmit={handleSubmit} className="form-container slim-modal">
          <h1>Edit User Info</h1>
          <button onClick={onClose} className="close-modal-button">&times;</button>
          
          <div className="form-group">
            <label>Nickname:</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Profile Picture:</label>
            {profilePicture && (
              <div className="profile-pic-container">
                <img src={profilePicture} alt="Profile Preview" className="cover-preview" />
              </div>
            )}
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '0px'}}> 
               <input type="file" name='profilePicture' onChange={handleFileChange} style={{border: 'none'}}/>
               {profilePicture && (
                 <FontAwesomeIcon icon={faTrash} style={{color: 'red'}} onClick={handleRemovePicture} className="remove-pic-button"/>
               )}
            </div>
          </div>
          
          <div className='update-delete'>
            <button type="submit" className='primary-button update-button'>Update</button>
            <button type="button" onClick={onDelete} className='primary-button delete-button'>
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }}/>Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileHeader = ({ nickname: initialNickname, email, pfp:initialPfp }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState(initialNickname);
  const [profilePicture, setProfilePicture] = useState(initialPfp);
  const accessToken = localStorage.getItem('accessToken');
  const userId = getUserId();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${userId}`, {
          headers: {
            accessToken
          },
        });
        if (response.status === 200) {
          const userData = response.data;
          setNickname(userData.nickname);
          setProfilePicture(userData.profilePicture);
        } else {
          console.error('Failed to fetch user data:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, accessToken]);

  const handleSave = (updatedData) => {
    setNickname(updatedData.nickname);
    setProfilePicture(updatedData.profilePicture);
    setIsModalOpen(false);
    console.log('Updated info:', updatedData);
  };

  return (
    <div className="profile-header">
      <div className="profile-info-container">
        <div style={{ display: 'flex' }}>
          <div className="profile-picture">
            <img
              src={profilePicture ? `http://localhost:3001/${profilePicture}` : `http://localhost:3001/pfps/311e7ad01e414f0821610c9c4f7a48ae.jpg`}
              className="item-image"
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <h2>{nickname}</h2>
            <p>{email}</p>
          </div>
        </div>
        <div
          className="settings-icon-container"
          onClick={() => setIsModalOpen(true)}
        >
          <FontAwesomeIcon icon={faCog} className="settings-icon" />
        </div>
      </div>
      <hr className="separator" />
      <div className="header">
        <ul className="nav-list">
          <li className="nav-item"><Link to={`/profile/${userId}`}>Added books</Link></li>
          <li className="nav-item"><a href="#">Collection</a></li>
          <li className="nav-item"><Link to={`/profile/${userId}/reviews`}>Reviews</Link></li>
        </ul>
      </div>

      {/* Modal for editing user info */}
      <UserInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={{ nickname, email, profilePicture}}
        userId={userId}
        accessToken={accessToken}
        onUpdate={handleSave}
      />
    </div>
  );
};


export default ProfileHeader;