import { arrowDown } from '../assets/icons';

function ToResults() {
  function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }
  return (
    <button className="to-results" onClick={scrollToBottom}>
      Results {arrowDown}
    </button>
  );
}

export default ToResults;
