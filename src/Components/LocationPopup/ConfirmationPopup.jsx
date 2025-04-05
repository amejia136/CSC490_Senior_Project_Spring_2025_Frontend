import React from 'react';
import './LocationPopup.css';

const ConfirmationPopup = ({ onClose }) => {
    return (
        <div className="location-popup">
            <h2>Place Added!</h2>
            <button onClick={onClose}>Exit</button>
        </div>
    );
};

export default ConfirmationPopup;