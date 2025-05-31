// Achievements.jsx
import React, { useEffect, useState } from 'react';
import './Achievements.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { getAuth } from 'firebase/auth';
import {collection, doc, getDoc, getDocs} from 'firebase/firestore';
import { db } from '../../firebaseConfig';


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

    const [allAchievementsData, setAllAchievementsData] = useState([
        { id: 1, name: 'Visited New York', description: 'Visit any location within the state of New York.', image: nycCard, status: 'not started' },
        { id: 2, name: 'Visited California', description: 'Visit any location within the state of California.', image: californiaCard, status: 'not started' },
        { id: 3, name: 'Visited Florida', description: 'Visit any location within the state of Florida.', image: floridaCard, status: 'not started' },
        { id: 4, name: 'Visited Texas', description: 'Visit any location within the state of Texas.', image: texasCard, status: 'not started' },
        { id: 5, name: 'Visited Statue of Liberty', description: 'Visit the Statue of Liberty in New York City.', image: statueLibertyCard, status: 'not started' },
        { id: 6, name: 'Visited Golden Gate Bridge', description: 'Visit the Golden Gate Bridge in San Francisco.', image: goldenGateBridgeCard, status: 'not started' }, // reused California
        { id: 7, name: 'Visited Grand Canyon', description: 'Visit the Grand Canyon National Park.', image: grandCanyonCard, status: 'not started' },
        { id: 8, name: 'Visited Yellowstone', description: 'Visit Yellowstone National Park.', image: yellowstoneCard, status: 'not started' }, // reused Grand Canyon
        { id: 9, name: 'Visited Mount Rushmore', description: 'Visit Mount Rushmore in South Dakota.', image: mountRushmoreCard, status: 'not started' }, // reused Statue of Liberty
        { id: 10, name: 'Visited Great Smoky Mountains', description: 'Visit Great Smoky Mountains National Park.', image: greatSmokyMountainsCard, status: 'not started' }, // reused Grand Canyon
    ]);

    useEffect(() => {
        const fetchAchievements = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const userId = user.uid;

            const userAchieveCol = collection(db, "Users", userId, "userAchievements");
            const itinerariesCol = collection(db, "Users", userId, "Itineraries");

            const fullAchievements = [
                { id: 1, name: 'Visit New York!', image: nycCard, keyword: "NY" },
                { id: 2, name: 'Visit California', image: californiaCard, keyword: "CA" },
                { id: 3, name: 'Visit Florida', image: floridaCard, keyword: "FL" },
                { id: 5, name: 'Visit the Statue of Liberty', image: statueLibertyCard, keyword: "Statue of Liberty" },
                { id: 6, name: 'Visit the Golden Gate Bridge', image: goldenGateBridgeCard, keyword: "Golden Gate" },
                { id: 7, name: 'Visit the Grand Canyon', image: grandCanyonCard, keyword: "Grand Canyon" },
                { id: 8, name: 'Visit Yellowstone National Park', image: yellowstoneCard, keyword: "Yellowstone" },
                { id: 9, name: 'Visit Mount Rushmore', image: mountRushmoreCard, keyword: "Rushmore" },
                { id: 10, name: 'Visit the Great Smoky Mountains!', image: greatSmokyMountainsCard, keyword: "Smoky Mountains" },
            ];

            try {
                const [achievementsSnap, itinerariesSnap] = await Promise.all([
                    getDocs(userAchieveCol),
                    getDocs(itinerariesCol)
                ]);

                const completed = [];
                const inProgress = new Set();
                const completedIds = new Set();

                // 1. Process completed achievements
                achievementsSnap.forEach((docSnap) => {
                    const data = docSnap.data();
                    const clean = (str) => str?.replace(/["']/g, '').trim().toLowerCase();

                    const match = fullAchievements.find(a => clean(a.name) === clean(data.Name));
                    if (match && data.isComplete) {
                        completed.push({
                            id: match.id,
                            name: match.name,
                            description: clean(data.Description),
                            image: match.image,
                            status: 'completed',
                        });
                        completedIds.add(match.id);
                    }
                });

                // 2. Check all itinerary locations for "in progress"
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

                // 3. Determine remaining achievements (either in progress or not started)
                const remaining = fullAchievements
                    .filter(a => !completedIds.has(a.id))
                    .map(a => ({
                        ...a,
                        description: a.name.includes("Empire")
                            ? 'Visit the Empire State Building on a trip to NYC!'
                            : a.description || '',
                        status: inProgress.has(a.id) ? 'in progress' : 'not started',
                    }));

                setCompletedAchievements(completed);
                setAllAchievementsData(remaining);
            } catch (error) {
                console.error("Error fetching user achievements or itineraries:", error);
            }
        };

        fetchAchievements();
    }, []);








    const [completedAchievements, setCompletedAchievements] = useState([]);

    const [showCompleted, setShowCompleted] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const handleCompleteAchievement = (achievement) => {
        setCompletedAchievements(prev => [...prev, { ...achievement, status: 'completed' }]);
        setAllAchievementsData(prev => prev.filter(a => a.id !== achievement.id));
    };

    return (
        <section
            className="achievements"
            style={{
                backgroundImage: `
      linear-gradient(
        to bottom, 
        rgba(255,255,255,0.0) 0%, 
        rgba(255,255,255,0.0) 22%, /* <<< Start fade lower */
        rgba(173,216,230,0.7) 34%, 
        rgba(160,202,220,0.85) 40%, 
        rgba(144,195,212,1) 60%
      ),
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
                    Your Travel Achievements
                </h1>

                {/* Progress Bar */}
                <div className="progressBarContainer" data-aos="fade-up">
                    <div className="progressBar">
                        <div
                            className="progressFill"
                            style={{ width: `${(completedAchievements.length / (completedAchievements.length + allAchievementsData.length)) * 100}%` }}
                        ></div>
                    </div>
                    <p className="progressText">
                        {completedAchievements.length} / {completedAchievements.length + allAchievementsData.length} Achievements Completed
                    </p>
                </div>

                {/* Layout */}
                <div className="achievementsLayout" data-aos="fade-up">
                    <div className="sidebarTabsWrapper">
                        <div className="sidebarTabs">
                            <button className={showCompleted ? "tabButton active" : "tabButton"} onClick={() => { setShowCompleted(true); setShowAll(false); }}>🏆 Completed Achievements</button>
                            <button className={showAll ? "tabButton active" : "tabButton"} onClick={() => { setShowCompleted(false); setShowAll(true); }}>🗺️ All Achievements</button>
                        </div>
                    </div>

                    <div className="achievementsCards">
                        <div className="cardGrid">

                            {/* COMPLETED Achievements - NO grayscale */}
                            {showCompleted && completedAchievements.map((achievement) => (
                                <div key={achievement.id} className="achievementCardRow">
                                    <img src={achievement.image} alt={achievement.name} className="achievementImage completed" />
                                    <div className="achievementInfo">
                                        <h3>{achievement.name}</h3>
                                        <p>{achievement.description}</p>
                                        <p className="status">✅ Completed</p>
                                    </div>
                                </div>
                            ))}

                            {/* ALL Achievements - WITH grayscale */}
                            {showAll && allAchievementsData.map((achievement) => (
                                <div key={achievement.id} className="achievementCardRow grayscaleCard">
                                    <img src={achievement.image} alt={achievement.name} className="achievementImage" />
                                    <div className="achievementInfo">
                                        <h3>{achievement.name}</h3>
                                        <p>{achievement.description}</p>
                                        <p className="status">Progress: {achievement.status}</p>
                                        <div className={`completeStatusTag ${achievement.status === 'completed' ? 'done' : 'notDone'}`}>
                                            {achievement.status === 'completed' ? '✅ Completed' : '❌ Not Completed'}
                                        </div>

                                        {achievement.status === 'in progress' ? (
                                            <button className="inProgressButton" disabled>🕒 In Progress</button>
                                        ) : (
                                            <button className="completeButton" onClick={() => handleCompleteAchievement(achievement)}>✅ Complete</button>
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


