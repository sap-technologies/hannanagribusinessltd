import React from 'react';
import './BackButton.css';

const BackButton = ({ onClick, label = 'Back' }) => {
  return (
    <div className="back-button-container">
      <button onClick={onClick} className="back-button">
        <span className="back-button-icon">←</span>
        {label}
      </button>
    </div>
  );
};

export default BackButton;
