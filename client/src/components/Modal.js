import { useState, useEffect, useRef } from 'react';

import { info } from '../assets/icons';

function Modal({ text, toggle }) {
  const [showModal, setShowModal] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const initialLoadRef = useRef();
  initialLoadRef.current = initialLoad;

  useEffect(() => {
    if (!initialLoadRef.current) {
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
    setInitialLoad(false);
  }, [toggle, initialLoadRef]);
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
