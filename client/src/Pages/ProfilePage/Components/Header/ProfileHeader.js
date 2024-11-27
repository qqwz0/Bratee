import React, { useState, useEffect } from 'react';
import './ProfileHeader.css';
import { Link, useParams } from 'react-router-dom';
import { getUserId } from '../../../../Components/Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UserInfoModal = ({ isOpen, onClose, user, onUpdate, onDelete, userId, accessToken }) => {
  const [nickname, setNickname] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);

  const serverUrl = `${process.env.REACT_APP_API_URL}` + '/';

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
    // Show confirmation to the user before proceeding with the deletion
    if (window.confirm("Are you sure you want to remove your profile picture?")) {
      // Send the flag to delete the profile picture along with the nickname (or other fields)
      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('deleteProfilePicture', 'true'); // Flag to delete the profile picture
  
      // Send the update request to the backend
      axios.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, formData, {
        headers: { accessToken },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log('Profile picture removed');
          onUpdate({
            nickname: response.data.user.nickname,
            profilePicture: null,  // Update frontend to reflect the removal
          });
        } else {
          console.error('Failed to remove profile picture');
        }
      })
      .catch((error) => {
        console.error('Error removing profile picture', error);
      });
    }
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
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, formData, {
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
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, formData, {
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
          <h1>Редагувати профіль</h1>
          <button onClick={onClose} className="close-modal-button">&times;</button>
          
          <div className="form-group">
            <label>Нік:</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Фото профілю:</label>
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
            <button type="submit" className='primary-button update-button'>Оновити</button>
            <button type="button" onClick={onDelete} className='primary-button delete-button'>
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }}/>Видалити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileHeader = ({ nickname: initialNickname, email, pfp:initialPfp }) => {
  const { id: urlUserId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState(initialNickname);
  const [profilePicture, setProfilePicture] = useState(initialPfp);
  const accessToken = localStorage.getItem('accessToken');
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = getUserId();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${urlUserId}`, {
          headers: {
            accessToken
          },
        });
        if (response.status === 200) {
          const userData = response.data;
          console.log(userData.isAdmin)
          setNickname(userData.nickname);
          setProfilePicture(userData.profilePicture);
          setIsAdmin(userData.isAdmin)
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
              src={profilePicture ? `${process.env.REACT_APP_API_URL}/${profilePicture}` : `${process.env.REACT_APP_API_URL}/pfps/311e7ad01e414f0821610c9c4f7a48ae.jpg`}
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
          <li className="nav-item"><Link to={`/profile/${urlUserId}/collections`}>Колекції</Link></li>
          <li className="nav-item"><Link to={`/profile/${urlUserId}`}>Додані книги</Link></li>
          <li className="nav-item"><Link to={`/profile/${urlUserId}/reviews`}>Відгуки</Link></li>
          {isAdmin && (
            <li className="nav-item"><Link to="/admin">Панель адміна</Link></li>
        )}
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