import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IonModal, IonButton, IonContent } from '@ionic/react';
import { isMobile } from 'react-device-detect';
import './ModalContainer.css';

const ModalContainer = ({ showModal, closeModal, title, children, hideHeader }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (showModal) {
      setAnimationClass('open');
    } else {
      setAnimationClass('close');
    }
  }, [showModal]);

  return isMobile ? (
    <IonModal isOpen={showModal} onDidDismiss={closeModal} cssClass="mobile-modal">
      <IonContent>
        <div className="mobile-modal-header">
          <h2 className="mobile-modal-title">{title}</h2>
          <IonButton onClick={closeModal} color="light" className="mobile-modal-close-btn">
            &times;
          </IonButton>
        </div>
        <div className="mobile-modal-content">{children}</div>
      </IonContent>
    </IonModal>
  ) : (
    <div className={`desktop-modal ${showModal ? 'show' : ''} ${animationClass}`}>
      <div className={`desktop-modal-overlay ${animationClass}`} onClick={closeModal} />
      <div className={`desktop-modal-content ${animationClass}`}>
        <div className={`desktop-modal-header ${hideHeader ? 'd-none' : ''}`}>
          <h2 className="desktop-modal-title">{title}</h2>
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className="desktop-modal-body">{children}</div>
      </div>
    </div>
  );
};

ModalContainer.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ModalContainer.defaultProps = {
  title: 'Modal Title',
};

export default ModalContainer;
