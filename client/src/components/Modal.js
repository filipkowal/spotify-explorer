import { xLarge } from '../assets/icons';

function Modal({ text, isDisplayed }) {
  return (
    <>
      {isDisplayed ? (
        <div className="modal">
          <div className="container">
            <span className="x">{xLarge}</span>{' '}
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
