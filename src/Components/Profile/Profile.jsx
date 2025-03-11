import React, { useState } from 'react';
import './Profile.css'; // Create a Profile.css file
import { BsListTask } from "react-icons/bs";
import { TbApps } from "react-icons/tb";
import { Link } from 'react-router-dom';
import backgroundImage from '../../Assets/backgroundForProfile.jpg';
import styles from './Profile.css';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+1');
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('male'); // Default to male
    const [language, setLanguage] = useState('english'); // Default to english
    const [bio, setBio] = useState('');


    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);

        console.log('Profile saved:', { name, email, phoneNumber, username, gender, language, bio });
    };
    return (
        <div
            className={styles.profileContainer} // Use styles.profileContainer
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: 'var(--bodyColor)', // Fallback
            }}
        >
            {/* Place your JSX content inside this div */}
            <nav className="profile-navbar">
                <div className="leftIcons">
                    <Link to="/">
                        <BsListTask className="icon" />
                    </Link>
                    <TbApps className="icon" />
                </div>
            </nav>

            <div className="profile-content">
                <h1>Your Profile</h1>

                <div className="profile-form">
                    {/* ... (Your form content) ... */}
                    <div className="input-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="gender">Gender:</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="language">Language:</label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="bio">Bio:</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Enter your bio"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;