import './App.css';
import { useState } from 'react';
import './styles/main.css';

import User from './components/User';
import Playlists from './components/Playlists';
import Modal from './components/Modal';

function App() {
  const [loadedData, setLoadedData] = useState([]);

  return (
    <div className="App">
      {loadedData.some(data => !data) ? <p>Loading...</p> : ''}
      <User setLoadedData={setLoadedData} />
      <Playlists setLoadedData={setLoadedData} />
      <Modal />
    </div>
  );
}

export default App;
