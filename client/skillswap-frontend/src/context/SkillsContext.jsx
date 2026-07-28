import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const SkillsContext = createContext(null);

export function SkillsProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [skillsRes, categoriesRes, levelsRes] = await Promise.all([
          api('/api/skills', { auth: false }),
          api('/api/skills/meta/categories', { auth: false }),
          api('/api/skills/meta/levels', { auth: false })
        ]);
        if (cancelled) return;
        setSkills(skillsRes.results);
        setCategories(categoriesRes);
        setLevels(levelsRes);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const getSkillById = (id) => skills.find(s => s.id === id);

  const value = { skills, categories, levels, loading, error, getSkillById };
  return <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>;
}

export function useSkills() {
  const ctx = useContext(SkillsContext);
  if (!ctx) throw new Error('useSkills must be used inside <SkillsProvider>');
  return ctx;
}
