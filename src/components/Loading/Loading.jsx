import { useEffect, useState } from 'react';

export default function Loading() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${hide ? 'hidden' : ''}`}>
      <div className="loader" />
      <p className="loading-text">Loading...</p>
    </div>
  );
}
