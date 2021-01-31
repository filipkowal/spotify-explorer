import './App.css';
import { useState } from 'react';

import User from './components/User';
import Playlists from './components/Playlists';

function App() {
  const [loadedData, setLoadedData] = useState([]);

  return (
    <div className="App">
      {loadedData.some(data => !data) ? <p>Loading...</p> : ''}
      <User setLoadedData={setLoadedData} />
      <Playlists setLoadedData={setLoadedData} />
    </div>
  );
}

export default App;
