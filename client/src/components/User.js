import { useEffect, useState } from 'react';

import { getUser, logout } from '../services';

function User({ setLoadedData }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    setLoadedData(prevState => [...prevState, { user: false }]);
    getUser()
      .then(r => setUser(r) || {})
      .then(() => setLoadedData(prevState => [...prevState, { user: true }]));
  }, []);

  return (
    <p className="user secondary">
      <span className="username">{user.display_name}</span>{' '}
      <button onClick={logout}>Logout</button>
    </p>
  );
}
export default User;
