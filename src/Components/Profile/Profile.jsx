import React, {useState, useEffect, useContext, useCallback} from 'react';
import './Profile.css';
import {BsListTask} from "react-icons/bs";
import {TbApps} from "react-icons/tb";
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../../UserContext';
import {db} from '../../firebaseConfig';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import backgroundVideo from '../../Assets/ProfileVideo.mp4';
import axios from "axios";
import {useTranslation} from 'react-i18next';
import i18n from "../../Translations/i18n";


const Profile = () => {
    const {user} = useContext(UserContext);
    const {t} = useTranslation();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        username: '',
        gender: '',
        language: '',
        bio: '',
    });

    const [extras, setExtras] = useState({
        preferences: {},
        achievementProgress: {},
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const languageMap = {
        English: "en",
        Spanish: "es",
    };

    const fetchProfileData = useCallback(async () => {
        const userId = user?.uid || user?.id;
        if (!userId) {
            setError("User ID is missing. Please log in again.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`Fetching profile data for user ID: ${userId}`);

            const userRef = doc(db, 'Users', userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const rawData = userDoc.data();
                const normalizedData = {
                    name: rawData.Name || rawData.name || '',
                    email: rawData.Email || rawData.email || '',
                    phoneNumber: rawData.PhoneNumber || rawData.phoneNumber || '',
                    username: rawData.Username || rawData.username || '',
                    gender: rawData.Gender || rawData.gender || '',
                    language: rawData.Language || rawData.language || '',
                    bio: rawData.bio || '',
                };

                const extractedExtras = {
                    preferences: rawData.preferences || {},
                    achievementProgress: rawData.achievementProgress || {},
                };

                setProfileData(prev => ({
                    ...prev,
                    ...normalizedData
                }));

                setExtras(extractedExtras);

            } else {
                setError(`Profile for user ID "${userId}" not found in Firestore.`);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);

            if (error.message.includes("PERMISSION_DENIED")) {
                setError("Firestore permission denied. Make sure Firestore rules allow read access to /Users/{userId}.");
            } else if (error.code === 'permission-denied') {
                setError("Firestore error: Permission denied. Check your Firestore security rules.");
            } else if (error.code === 'not-found') {
                setError(`No document found for user ID "${userId}".`);
            } else if (error.message.toLowerCase().includes("network")) {
                setError("Network error. Please check your internet connection.");
            } else {
                setError(`Unexpected Firestore error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, [user?.uid, user?.id]);

    useEffect(() => {
        if (user?.uid) {
            fetchProfileData();
        }
    }, [user?.uid, fetchProfileData]);

    useEffect(() => {

        if (profileData.language) {
            i18n.changeLanguage(languageMap[profileData.language] || "en");
        }
    }, [profileData.language]);


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLanguageChange = (e) => {
        const {name, value} = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!user?.uid) return;
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://127.0.0.1:5000/profile/save-profile', {
                userID: user.uid,
                ...profileData
            });

            console.log("✅ Profile saved successfully:", response.data);
            localStorage.setItem('appLanguage', languageMap[profileData.language] || 'en');
            sessionStorage.setItem('appLanguage', languageMap[profileData.language] || 'en');
            setIsEditing(false);
            fetchProfileData();
        } catch (error) {
            console.error('❌ Error saving profile:', error);

            if (error.response) {
                // Server responded with a status code other than 2xx
                const message = error.response.data?.error || error.response.statusText;
                setError(`Backend error: ${message} (Status: ${error.response.status})`);
            } else if (error.request) {
                // Request was made but no response
                setError("No response from server. Is your Flask backend running?");
            } else {
                // Something else happened
                setError(`Unexpected error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };


    // Edit mode toggle
    const handleEdit = () => setIsEditing(true);

    const handleSecurity = () => navigate('/account-security');

    const handleBackToHome = () => navigate('/');


    const formatKey = (str) =>
        str
            .replace(/([A-Z])/g, ' $1')        // split camelCase
            .replace(/\b\w/g, c => c.toUpperCase()); // capitalize each word


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
                    <BsListTask className="icon" onClick={handleBackToHome}/>
                    <TbApps className="icon"/>
                </div>
            </nav>

            <div className="profile-content">
                <h1>{t('Your Profile')}</h1>

                {loading ? (
                    <p>{t('Loading...')}</p>
                ) : isEditing ? (
                    <div className="profile-form">
                        {/* Name */}
                        <div className="input-group">
                            <label htmlFor="name">{t('Name')}:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={profileData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="email">{t('Email')}:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="input-group">
                            <label htmlFor="phoneNumber">{t('Phone Number')}:</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={profileData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Username */}
                        <div className="input-group">
                            <label htmlFor="username">{t('Username')}:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={profileData.username}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Gender */}
                        <div className="input-group">
                            <label htmlFor="gender">{t('Gender')}:</label>
                            <select
                                id="gender"
                                name="gender"
                                value={profileData.gender}
                                onChange={handleInputChange}
                            >
                                <option value="Male">{t('Male')}</option>
                                <option value="Female">{t('Female')}</option>
                                <option value="Other">{t('Other')}</option>
                            </select>
                        </div>

                        {/*Language*/}
                        <div className="input-group">
                            <label htmlFor="language">{t('Language')}:</label>
                            <select
                                id="language"
                                name="language"
                                value={profileData.language}
                                onChange={handleInputChange}
                            >
                                <option value="English">{t('English')}</option>
                                <option value="Spanish">{t('Spanish')}</option>
                            </select>
                        </div>


                        {/* Bio */}
                        <div className="input-group">
                            <label htmlFor="bio">{t('Bio')}:</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={profileData.bio}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button onClick={handleSave} disabled={loading}>
                            {t('Save Changes')}
                        </button>
                    </div>
                ) : (

                    <div className="profile-view">
                        {Object.keys(profileData)
                            .filter(key => !['Password', 'Login'].includes(key))
                            .map((key) => (
                                <p key={key}>
                                    <strong>{t(formatKey(key))}:</strong> {profileData[key] || t('N/A')}
                                </p>
                            ))}

                        {/* Show nested Preferences */}
                        <p><strong>{t('Preferences')}:</strong></p>
                        <ul style={{margin: '0.25rem 0 1rem 1rem', padding: 0, listStyle: 'none'}}>
                            {Object.entries(extras.preferences).map(([subKey, subValue]) => (
                                <li key={subKey}>
              <span style={{fontWeight: 525}}>
                  {formatKey(subKey)}:
              </span> {subValue === '' || subValue === 0 ? t('N/A') : subValue}
                                </li>
                            ))}
                        </ul>

                        {/* Show nested Achievement Progress */}
                        <p><strong>{t('AchievementProgress')}:</strong></p>
                        <ul style={{margin: '0.25rem 0 1rem 1rem', padding: 0, listStyle: 'none'}}>
                            {Object.entries(extras.achievementProgress).map(([subKey, subValue]) => (
                                <li key={subKey}>
              <span style={{fontWeight: 525}}>
                  {subKey === "achievementId1.completed"
                      ? t('Achievements Completed:')
                      : subKey === "achievementId1.total"
                          ? t('Achievement Total:')
                          : formatKey(subKey) + ":"}
              </span> {subValue === '' || subValue === 0 ? t('N/A') : subValue}
                                </li>
                            ))}
                        </ul>


                        <button onClick={handleEdit} disabled={loading}>
                            {t('Edit Profile')}
                        </button>

                        <button onClick={handleSecurity} disabled={loading}>
                            {t('Account Security')}
                        </button>

                    </div>
                )}

                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default Profile;

