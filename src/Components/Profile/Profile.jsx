import React, { useState } from 'react';
import './Profile.css';
import { BsListTask } from "react-icons/bs";
import { TbApps } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import backgroundVideo from '../../Assets/ProfileVideo.mp4'

const Profile = () => {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phoneNumber, setPhoneNumber] = useState('+1 123-456-7890');
    const [username, setUsername] = useState('johndoe123');
    const [gender, setGender] = useState('Male');
    const [language, setLanguage] = useState('English');
    const [bio, setBio] = useState('A brief bio...');

    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);

        console.log('Profile saved:', { name, email, phoneNumber, username, gender, language, bio });
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="profileContainer">
            <video
                className="backgroundVideo"
                src={backgroundVideo}
                autoPlay
                loop
                muted
            />
            <nav className="profile-navbar">
                <div className="leftIcons">
                    <BsListTask className="icon" onClick={handleBackToHome} />
                    <TbApps className="icon" />
                </div>
            </nav>

            <div className="profile-content">
                <h1>Your Profile</h1>

                {isEditing ? (
                    <div className="profile-form">
                        <div className="input-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="gender">Gender:</label>
                            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="language">Language:</label>
                            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <option value="english">English</option>
                                <option value="spanish">Spanish</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="bio">Bio:</label>
                            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                        </div>

                        <button onClick={handleSave}>Save Changes</button>
                    </div>
                ) : (
                    <div className="profile-view">
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone:</strong> {phoneNumber}</p>
                        <p><strong>Username:</strong> {username}</p>
                        <p><strong>Gender:</strong> {gender}</p>
                        <p><strong>Language:</strong> {language}</p>
                        <p><strong>Bio:</strong> {bio}</p>

                        <button onClick={handleEdit}>Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;