// Data layer for the homepage "Top Mentors" section. Unlike skillsApi.js's
// useSkills (client-side sort/filter over the full catalog), this is a
// thin fetch of a small, already-curated list — the admin decides exactly
// who's in it and in what order (see server/src/controllers/
// topMentorsController.js), so there's no client-side selection logic
// here at all, deliberately.

import { useEffect, useState } from 'react';
import { api } from './api.js';

export function useTopMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    api.get('/api/mentors/top')
      .then((data) => { if (alive) setMentors(data.mentors || []); })
      .catch((err) => { if (alive) setError(err); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return { mentors, loading, error };
}
