import React, { useState } from 'react';
import "./Details.css";
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import stateImages from "../../Assets/stateImages";
import { getAuth } from 'firebase/auth';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';

const DetailsPage = () => {
    const [selectedState, setSelectedState] = useState('');
    const [stateInfo, setStateInfo] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [showAddCommentForm, setShowAddCommentForm] = useState(false);
    const [newComment, setNewComment] = useState({ comment: '', place: '' });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { t } = useTranslation();

    const allStates = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
        "Wisconsin", "Wyoming"
    ];

    const handleStateChange = async (event) => {
        const state = event.target.value;
        setSelectedState(state);
        setStateInfo(null);
        setComments([]);
        setShowComments(false);
        setShowAddCommentForm(false);

        if (state) {
            const locationDocRef = doc(db, 'Locations', state);
            try {
                const docSnap = await getDoc(locationDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data && data.Comments) {
                        setComments(data.Comments);
                    }
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        }

        const details = {
            whyVisit: `${state} - Why Visit`
        };

        setStateInfo(details);
    };

    const handleNextImage = () => {
        if (!stateImages[selectedState]) return;
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % stateImages[selectedState].length);
    };

    const handlePrevImage = () => {
        if (!stateImages[selectedState]) return;
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + stateImages[selectedState].length) % stateImages[selectedState].length);
    };

    const handleCommentsClick = () => {
        setShowComments(!showComments);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!selectedState) return;

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert("You must be logged in to leave a comment.");
            return;
        }

        const newCommentData = {
            UserID: user.displayName || user.email || user.uid,
            Comment: newComment.comment,
            recommendedName: newComment.place,
        };

        const locationDocRef = doc(db, 'Locations', selectedState);

        try {
            await updateDoc(locationDocRef, {
                Comments: arrayUnion(newCommentData),
            });

            setComments((prevComments) => [...prevComments, newCommentData]);
            setNewComment({ comment: '', place: '' });
            setShowAddCommentForm(false);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <section className="detailPageSection">
            <div className="detailsContent container" data-aos="fade">
                <h2 className="detailsTitle" data-aos="zoom-in">{t('Details')}</h2>
                <p className="detailsIntro" data-aos="fade-in">
                    {t('Explore places so you can find your destination for your next trip.')}
                </p>

                <div className="dropdownContainer" data-aos="fade-up">
                    <select value={selectedState} onChange={handleStateChange} className="stateDropdown">
                        <option value="">{t('Choose a state')}</option>
                        {Object.keys(stateImages).map((stateName) => (
                            <option key={stateName} value={stateName}>{t(stateName)}</option>
                        ))}
                    </select>
                </div>

                {!selectedState && (
                    <div className="recommendedStates" data-aos="fade-up">
                        <h3 className="recommendedTitle">{t('Our Recommended Destinations for This Summer')}</h3>
                        {["Hawaii", "California", "Florida"].map((state) => (
                            <div key={state} className="stateDetails" data-aos="fade-up">
                                <h2>{t(state)}</h2>
                                {stateImages[state] && (
                                    <div className="stateImagesCarousel">
                                        {stateImages[state].map((image, i) => (
                                            <img
                                                key={i}
                                                src={image}
                                                alt={`${state} ${i + 1}`}
                                                className="stateImage"
                                            />
                                        ))}
                                    </div>
                                )}
                                <div className="infoBox">
                                    <h4 className="infoTitle">{t('Why Visit')}</h4>
                                    <p className="infoDesc">{t(`${state} - Why Visit`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedState && stateInfo && (
                    <div className="stateDetails" data-aos="fade">
                        <h2>{t(selectedState)}</h2>
                        {stateInfo.whyVisit && (
                            <div className="infoBox">
                                <h4 className="infoTitle">{t('Why Visit')}</h4>
                                <p className="infoDesc">{t(stateInfo.whyVisit)}</p>
                            </div>
                        )}
                        {stateImages[selectedState] && (
                            <div className="stateImagesCarousel">
                                <button onClick={handlePrevImage} className="arrowButton">◀</button>
                                <img
                                    src={stateImages[selectedState][currentImageIndex]}
                                    alt={`${selectedState} ${currentImageIndex + 1}`}
                                    className="stateImage"
                                />
                                <button onClick={handleNextImage} className="arrowButton">▶</button>
                            </div>
                        )}

                        <button className="commentButton" onClick={handleCommentsClick}>
                            {showComments ? t('Hide Comments') : t('Show Comments')}
                        </button>

                        {showComments && (
                            <div className="commentsSection">
                                <h3>{t('User Recommendations')}</h3>
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <p><strong>{t('User')}:</strong> {comment.UserID}</p>
                                            {comment.recommendedName && (
                                                <p><strong>{t('Recommended Place')}:</strong> {comment.recommendedName}</p>
                                            )}
                                            <p><strong>{t('Comment')}:</strong> {comment.Comment}</p>
                                            <hr />
                                        </div>
                                    ))
                                ) : (
                                    <p>{t('No user recommendations yet for')} {t(selectedState)}.</p>
                                )}

                                <button className="addCommentButton" onClick={() => setShowAddCommentForm(!showAddCommentForm)}>
                                    {showAddCommentForm ? t('Cancel') : t('Add a Comment')}
                                </button>

                                {showAddCommentForm && (
                                    <form className="addCommentForm" onSubmit={handleAddComment}>
                                        <input
                                            type="text"
                                            placeholder={t('Comment')}
                                            value={newComment.comment}
                                            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder={t('Recommended Place Name')}
                                            value={newComment.place}
                                            onChange={(e) => setNewComment({ ...newComment, place: e.target.value })}
                                        />
                                        <button type="submit">{t('Submit Comment')}</button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DetailsPage;
