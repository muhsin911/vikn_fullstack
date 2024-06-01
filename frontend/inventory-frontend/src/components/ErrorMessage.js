import React from 'react';
import './ErrorMessage.css'; // Import the CSS file

const ErrorMessage = ({ error }) => {
    if (!error) return null;

    return (
        <div className="error-message">
            {error.message}
        </div>
    );
};

export default ErrorMessage;
