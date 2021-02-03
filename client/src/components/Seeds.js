import { useState, useEffect } from 'react';

function Seeds({ seedTracks }) {
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    const newCircles = [];
    for (let i = 0; i < 5; i++) {
      if (i < seedTracks.length) {
        newCircles.push('@');
      } else {
        newCircles.push('O');
      }
    }
    setCircles(newCircles);
  }, [seedTracks]);
  return (
    <p className="seeds secondary">
      Seeds:{' '}
      {circles.map((c, i) => (
        <span className="circle" key={i}>
          {c}
        </span>
      ))}
    </p>
  );
}

export default Seeds;
