import { useEffect, useState } from 'react';

import { getUser } from '../services';

function User({ setLoadedData }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    setLoadedData(prevState => [...prevState, { user: false }]);
    getUser()
      .then(r => setUser(r) || {})
      .then(() => setLoadedData(prevState => [...prevState, { user: true }]));
  }, []);
  return <p className="user secondary">{user.display_name}</p>;
}
export default User;
