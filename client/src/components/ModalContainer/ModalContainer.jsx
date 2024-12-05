import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ModalContainer.css';

const ModalContainer = ({ showModal, closeModal, title, children, hideHeader, fullView, hidePadding }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (showModal) {
      setAnimationClass('open');
    } else {
      setAnimationClass('close');
    }
  }, [showModal]);

  return (
    <div className={`desktop-modal ${showModal ? 'show' : ''} ${animationClass} ${fullView ? 'full-view' : ''}`}>
      <div className={`desktop-modal-overlay ${animationClass}`} onClick={closeModal} />
      <div className={`desktop-modal-content position-relative ${animationClass} ${fullView ? 'full-view' : ''}`}>
        <div className={`desktop-modal-header ${hideHeader ? 'd-none' : ''}`}>
          <h2 className="desktop-modal-title">{title}</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <div className={`desktop-modal-body h-100 ${fullView ? 'full-view' : ''} ${hidePadding ? 'p-0' : ""}`}>{children}</div>
      </div>
    </div>
  );
};

ModalContainer.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  hideHeader: PropTypes.bool,
  fullView: PropTypes.bool,
};

ModalContainer.defaultProps = {
  title: 'Modal Title',
  hideHeader: false,
  fullView: false,
};

export default ModalContainer;
