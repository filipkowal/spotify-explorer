import { useState, useEffect } from 'react';

import { info } from '../assets/icons';

function Modal({ text, toggle }) {
  const [showModal, setShowModal] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (!initialLoad) {
      console.log('toggle Modal');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
    setInitialLoad(false);
  }, [toggle]);
  return (
    <>
      {showModal ? (
        <div className="modal">
          <div className="container">
            <span className="info-icon">{info}</span>
            <span className="text">{text}</span>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
export default Modal;
