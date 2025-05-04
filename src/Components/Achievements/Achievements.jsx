import React, {useEffect, useRef, useState} from 'react';
import './Achievements.css';
import Aos from 'aos';
import 'aos/dist/aos.css';


const AchievementsPage = () => {
    useEffect(() => {
        Aos.init({ duration: 2000 });
    }, []);

    const allAchievementsData = [

        { id: 1, name: 'Visited New York', category: 'State Exploration', description: 'Visit any location within the state of New York.', status: 'not started' },
        { id: 2, name: 'Visited California', category: 'State Exploration', description: 'Visit any location within the state of California.', status: 'not started' },
        { id: 3,name: 'Visited Florida', category: 'State Exploration', description: 'Visit any location within the state of Florida.', status: 'not started' },
        { id: 4,name: 'Visited Texas', category: 'State Exploration', description: 'Visit any location within the state of Texas.', status: 'not started' },
        { id: 5,name: 'Visited Statue of Liberty', category: 'Landmark Exploration', description: 'Visit the Statue of Liberty in New York City.', status: 'not started' },
        { id: 6,name: 'Visited Golden Gate Bridge', category: 'Landmark Exploration', description: 'Visit the Golden Gate Bridge in San Francisco, California.', status: 'not started' },
        { id: 7,name: 'Visited Grand Canyon', category: 'Park Exploration', description: 'Visit the Grand Canyon National Park in Arizona.', status: 'not started' },
        { id: 8, name: 'Visited Yellowstone', category: 'Park Exploration', description: 'Visit Yellowstone National Park in Wyoming, Montana, and Idaho.', status: 'not started' },
        { id: 9, name: 'Visited Mount Rushmore', category: 'Landmark Exploration', description: 'Visit Mount Rushmore National Memorial in South Dakota.', status: 'not started' },
        { id: 10, name: 'Visited Great Smoky Mountains', category: 'Park Exploration', description: 'Visit Great Smoky Mountains National Park in North Carolina and Tennessee.', status: 'not started' },
    ];
    //hardcoded list of completed achievements.
    const [completedAchievements, setCompletedAchievements] = useState([
        { id: 1, name: 'Visited New York', description: 'You have visited a location within the state of New York!', status: 'completed' },
        { id: 7, name: 'Visited Grand Canyon', description: 'You have visited the Grand Canyon National Park!', status: 'completed' },
    ]);

    const completedAchievementsRef = useRef(null);
    const allAchievementsRef = useRef(null);

    const [showCompleted, setShowCompleted] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const sortedAchievements = (achievementsToSort) => {
        return [...achievementsToSort].sort((a, b) => {
            const order = { completed: 0, 'in progress': 1, 'not started': 2 };
            return order[a.status] - order[b.status];
        });
    };

    const resetView = () => {
        setShowCompleted(false);
        setShowAll(false);
    };

    return (
        <section className="achievements">
            <div className="overlay"></div>

            <div className="achievementsContent container">
                <h1 data-aos="fade-up" className="achievementsTitle">
                    Your Travel Achievements
                </h1>

                <div data-aos="fade-up" className="achievementsNavigation">
                    {showCompleted || showAll ? (
                        <button onClick={resetView} className="goBackButton">
                            Go Back
                        </button>
                    ) : (
                        <>
                            <button onClick={() => { setShowCompleted(true); setShowAll(false); }}>Completed Achievements</button>
                            <button onClick={() => { setShowAll(true); setShowCompleted(false); }}>All Achievements</button>
                        </>
                    )}
                </div>

                {showCompleted && (
                    <div ref={completedAchievementsRef} data-aos="fade-up" className="achievementsSection">
                        <h2>Completed Achievements</h2>
                        <div className="achievementsList">
                            {completedAchievements.map((achievement) => (
                                <div key={achievement.id} className="achievementCard">
                                    <h3>{achievement.name}</h3>
                                    <p className="description">{achievement.description}</p>
                                    <p className="status">Status: {achievement.status}</p>
                                </div>
                            ))}
                            {completedAchievements.length === 0 && <p>No completed achievements yet. Start exploring!</p>}
                        </div>
                    </div>
                )}

                {showAll && (
                    <div ref={allAchievementsRef} data-aos="fade-up" className="achievementsSection allAchievementsBottom">
                        <h2>All Achievements</h2>
                        <p className="allAchievementsIntro">Ready for a challenge? Here's a list of all the awesome travel
                            achievements you can unlock!</p>
                        <div className="achievementsList">
                            {sortedAchievements(allAchievementsData).map((achievement) => (
                                <div key={achievement.id} className="achievementCard possible">
                                    <h3>{achievement.name}</h3>
                                    <p className="description">{achievement.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default AchievementsPage;