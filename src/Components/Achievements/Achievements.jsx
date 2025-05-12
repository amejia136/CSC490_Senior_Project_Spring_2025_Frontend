// Achievements.jsx
import React, { useEffect, useState } from 'react';
import './Achievements.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { t } from 'i18next';

import nycCard from '../../Assets/Achievements_Card/nyc_card-300x300.jpg';
import californiaCard from '../../Assets/Achievements_Card/california_card-300x300.jpg';
import floridaCard from '../../Assets/Achievements_Card/florida_card-300x300.jpg';
import texasCard from '../../Assets/Achievements_Card/texas_card-300x300.jpg';
import grandCanyonCard from '../../Assets/Achievements_Card/grand_canyon_card-300x300.jpg';
import statueLibertyCard from '../../Assets/Achievements_Card/statue_of_liberty_photo-300x300.jpg';
import goldenGateBridgeCard from '../../Assets/Achievements_Card/golden_gate_bridge_card-300x300.jpg';
import greatSmokyMountainsCard from '../../Assets/Achievements_Card/great_smoky_mountains-300x300.jpg';
import mountRushmoreCard from '../../Assets/Achievements_Card/mount_rushmore_card-300x300.jpg';
import yellowstoneCard from '../../Assets/Achievements_Card/yellowstone_card-300x300.jpg';
import mountainsBackground from '../../Assets/mountains_achieve.jpg';

const AchievementsPage = () => {
    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, []);

    const [allAchievementsData, setAllAchievementsData] = useState([]);
    const [completedAchievements, setCompletedAchievements] = useState([]);
    const [showCompleted, setShowCompleted] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const fullAchievements = [
        { id: 1, name: 'Visit New York!', description: 'Visit any location within the state of New York.', image: nycCard, keyword: 'NY' },
        { id: 2, name: 'Visit California', description: 'Visit any location within the state of California.', image: californiaCard, keyword: 'CA' },
        { id: 3, name: 'Visit Florida', description: 'Visit any location within the state of Florida.', image: floridaCard, keyword: 'FL' },
        { id: 4, name: 'Visit Texas', description: 'Visit any location within the state of Texas.', image: texasCard, keyword: 'TX' },
        { id: 5, name: 'Visit the Statue of Liberty', description: 'Visit the Statue of Liberty in New York City.', image: statueLibertyCard, keyword: 'Statue of Liberty' },
        { id: 6, name: 'Visit the Golden Gate Bridge', description: 'Visit the Golden Gate Bridge in San Francisco.', image: goldenGateBridgeCard, keyword: 'Golden Gate' },
        { id: 7, name: 'Visit the Grand Canyon', description: 'Visit the Grand Canyon National Park.', image: grandCanyonCard, keyword: 'Grand Canyon' },
        { id: 8, name: 'Visit Yellowstone National Park', description: 'Visit Yellowstone National Park.', image: yellowstoneCard, keyword: 'Yellowstone' },
        { id: 9, name: 'Visit Mount Rushmore!', description: 'Visit Mount Rushmore in South Dakota!', image: mountRushmoreCard, keyword: 'Rushmore' },
        { id: 10, name: 'Visit the Great Smoky Mountains!', description: 'Visit Great Smoky Mountains National Park.', image: greatSmokyMountainsCard, keyword: 'Smoky Mountains' },
    ];



    useEffect(() => {
        const fetchAchievements = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const userId = user.uid;
            const userAchieveCol = collection(db, "Users", userId, "userAchievements");
            const itinerariesCol = collection(db, "Users", userId, "Itineraries");

            try {
                const [achievementsSnap, itinerariesSnap] = await Promise.all([
                    getDocs(userAchieveCol),
                    getDocs(itinerariesCol)
                ]);

                const completed = [];
                const inProgress = new Set();
                const completedIds = new Set();

                achievementsSnap.forEach((docSnap) => {
                    const data = docSnap.data();
                    const clean = (str) => str?.replace(/["']/g, '').trim().toLowerCase();
                    const match = fullAchievements.find(a => clean(a.name) === clean(data.Name));
                    if (match && data.isComplete) {
                        completed.push({
                            ...match,
                            status: 'completed'
                        });
                        completedIds.add(match.id);
                    }
                });

                itinerariesSnap.forEach(docSnap => {
                    const data = docSnap.data();
                    const mapLocations = data.mapLocations || [];
                    mapLocations.forEach(loc => {
                        fullAchievements.forEach(achievement => {
                            if (
                                !completedIds.has(achievement.id) &&
                                loc.address?.includes(achievement.keyword)
                            ) {
                                inProgress.add(achievement.id);
                            }
                        });
                    });
                });

                const remaining = fullAchievements
                    .filter(a => !completedIds.has(a.id))
                    .map(a => ({
                        ...a,
                        status: inProgress.has(a.id) ? 'in progress' : 'not started',
                    }));

                setCompletedAchievements(completed);
                setAllAchievementsData(remaining);
            } catch (error) {
                console.error("Error fetching achievements:", error);
            }
        };

        fetchAchievements();
    }, []);

    const handleCompleteAchievement = (achievement) => {
        setCompletedAchievements(prev => [...prev, { ...achievement, status: 'completed' }]);
        setAllAchievementsData(prev => prev.filter(a => a.id !== achievement.id));
    };

    const getDescription = (achievement) => {
        const key = `${achievement.name} - Description`;
        const translation = t(key);
        return translation !== key ? translation : achievement.description;
    };

    return (
        <section
            className="achievements"
            style={{
                backgroundImage: `
                    linear-gradient(to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.0) 22%, rgba(173,216,230,0.7) 34%, rgba(160,202,220,0.85) 40%, rgba(144,195,212,1) 60%),
                    url(${mountainsBackground})
                `,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'top center'
            }}
        >
            <div className="overlay"></div>
            <div className="achievementsContent container">
                <h1 data-aos="fade-up" className="achievementsTitle">
                    {t('Your Travel Achievements')}
                </h1>

                <div className="progressBarContainer" data-aos="fade-up">
                    <div className="progressBar">
                        <div
                            className="progressFill"
                            style={{
                                width: `${(completedAchievements.length / (completedAchievements.length + allAchievementsData.length)) * 100}%`
                            }}
                        ></div>
                    </div>
                    <p className="progressText">
                        {t('{{completed}} / {{total}} Achievements Completed', {
                            completed: completedAchievements.length,
                            total: completedAchievements.length + allAchievementsData.length
                        })}
                    </p>
                </div>

                <div className="achievementsLayout" data-aos="fade-up">
                    <div className="sidebarTabsWrapper">
                        <div className="sidebarTabs">
                            <button className={showCompleted ? "tabButton active" : "tabButton"} onClick={() => { setShowCompleted(true); setShowAll(false); }}>
                                🏆 {t('Completed Achievements')}
                            </button>
                            <button className={showAll ? "tabButton active" : "tabButton"} onClick={() => { setShowCompleted(false); setShowAll(true); }}>
                                🗺️ {t('All Achievements')}
                            </button>
                        </div>
                    </div>

                    <div className="achievementsCards">
                        <div className="cardGrid">
                            {showCompleted && completedAchievements.map((achievement) => (
                                <div key={achievement.id} className="achievementCardRow">
                                    <img src={achievement.image} alt={achievement.name} className="achievementImage completed" />
                                    <div className="achievementInfo">
                                        <h3>{t(achievement.name)}</h3>
                                        <p>{getDescription(achievement)}</p>
                                        <p className="status">✅ {t('Completed')}</p>
                                    </div>
                                </div>
                            ))}
                            {showAll && allAchievementsData.map((achievement) => (
                                <div key={achievement.id} className="achievementCardRow grayscaleCard">
                                    <img src={achievement.image} alt={achievement.name} className="achievementImage" />
                                    <div className="achievementInfo">
                                        <h3>{t(achievement.name)}</h3>
                                        <p>{getDescription(achievement)}</p>
                                        <p className="status">{t('Progress')}: {t(achievement.status)}</p>
                                        <div className={`completeStatusTag ${achievement.status === 'completed' ? 'done' : 'notDone'}`}>
                                            {achievement.status === 'completed'
                                                ? '✅ ' + t('Completed')
                                                : '❌ ' + t('Not Completed')}
                                        </div>
                                        {achievement.status === 'in progress' ? (
                                            <button className="inProgressButton" disabled>🕒 {t('In Progress')}</button>
                                        ) : (
                                            <button className="completeButton disabledButton">
                                                ✅ {t('Complete')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AchievementsPage;
