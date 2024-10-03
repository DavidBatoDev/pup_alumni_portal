import React from 'react';
import PropTypes from 'prop-types';
import './CustomAlert.css'; // Use the same CSS styles as before

const CustomAlert = ({ severity = 'info', message = '', onClose }) => {
  // Return null if no message is provided
  if (!message) return null;

  // Determine icon and styles based on severity
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'info':
        return <i className="fas fa-info-circle"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle"></i>;
      case 'error':
        return <i className="fas fa-times-circle"></i>;
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };

  return (
    <div className={`custom-alert custom-alert-${severity}`}>
      <div className="custom-alert-content">
        {getIcon()}
        <span className="custom-alert-message">{message}</span>
      </div>
      {/* Close button that triggers onClose prop */}
      {onClose && (
        <button className="custom-alert-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

// Define the prop types for type checking
CustomAlert.propTypes = {
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func, // onClose prop to handle close event
};

export default CustomAlert;
