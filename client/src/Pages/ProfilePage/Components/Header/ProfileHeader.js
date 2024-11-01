import React from 'react';
import './ProfileHeader.css';

const ProfileHeader = ({ nickname, email }) => {
  return (
    <div className="profile-header">

      <div className="profile-info-container">
        <div className="profile-picture"></div>
        <div className="profile-info">
          <h2>{nickname}</h2>
          <p>{email}</p>
        </div>
      </div>
      <hr className='separator'/>
      <div className="header">
        <ul className="nav-list">
          <li className="nav-item"><a href="#">Added books</a></li>
          <li className="nav-item"><a href="#">Collection</a></li>
          <li className="nav-item"><a href="#">Reviews</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileHeader;