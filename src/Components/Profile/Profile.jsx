import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Profile.module.css";
import defaultProfile from "../../Assets/profile-default.jpg";


function Profile() {


    const [profilePicture, setProfilePicture] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1',
        birthday: '',
        gender: 'male',
        language: 'english',
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        bio: 'A brief bio...',
        password: '',
    });
    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        console.log('Profile data saved:', profileData);
        setIsEditing(false);
    };

    const handleAchievementsClick = () => {
        navigate('/achievements');
    };

    return (
        <div className={styles["profile-container"]}>
            <h2>My Profile</h2>

            <div className={styles["profile-picture"]}>
                <img
                    src={profilePicture ? URL.createObjectURL(profilePicture) : defaultProfile}
                    alt="Profile Picture"
                    className={styles["profile-image"]}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                />
            </div>
            {isEditing ? (
                <div className={styles["edit-profile"]}>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="birthday">Birthday:</label>
                    <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        value={profileData.birthday}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <label htmlFor="language">Language:</label>
                    <select
                        id="language"
                        name="language"
                        value={profileData.language}
                        onChange={handleInputChange}
                    >
                        <option value="spanish">Spanish</option>
                        <option value="english">English</option>
                    </select>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                    />
                    <div className={styles["password-field"]}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={profileData.password}
                            onChange={handleInputChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles["show-password-button"]}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={toggleEditMode}>Cancel</button>
                </div>
            ) : (
                <div className={styles["view-profile"]}>
                    <p><strong>First Name:</strong> {profileData.firstName}</p>
                    <p><strong>Last Name:</strong> {profileData.lastName}</p>
                    <p><strong>Phone Number:</strong> {profileData.phoneNumber}</p>
                    <p><strong>Birthday:</strong> {profileData.birthday}</p>
                    <p><strong>Gender:</strong> {profileData.gender}</p>
                    <p><strong>Language:</strong> {profileData.language}</p>
                    <p><strong>Username:</strong> {profileData.username}</p>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Bio:</strong> {profileData.bio}</p>
                    <button onClick={toggleEditMode}>Edit Profile</button>
                </div>
            )}
            <button onClick={handleAchievementsClick}>Achievements</button>
        </div>
    );
}

export default Profile;