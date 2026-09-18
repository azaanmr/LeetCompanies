import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const LOCAL_STORAGE_KEYS = {
  THEME: 'lc_explorer_theme',
  SOLVED: 'lc_explorer_solved',
  BOOKMARKS: 'lc_explorer_bookmarks',
  FAV_COMPANIES: 'lc_explorer_fav_companies',
  NOTES: 'lc_explorer_notes',
};
function parseHash(hashStr) {
  const clean = (hashStr || '').replace(/^#\/?/, '').trim();
  if (!clean || clean === 'home') {
    return { tab: 'home', company: null };
  }
  if (clean.startsWith('company/')) {
    const slug = clean.split('company/')[1]?.split('?')[0]?.trim();
    return { tab: 'companies', company: slug || null };
  }
  if (clean === 'companies') {
    return { tab: 'companies', company: null };
  }
  if (clean === 'search') {
    return { tab: 'search', company: null };
  }
  if (clean === 'tracker') {
    return { tab: 'tracker', company: null };
  }
  return { tab: 'home', company: null };
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) || 'dark';
  });
  const initialNav = parseHash(window.location.hash);
  const [activeTab, setActiveTabState] = useState(initialNav.tab);
  const [selectedCompanySlug, setSelectedCompanySlugState] = useState(initialNav.company);
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [solvedMap, setSolvedMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SOLVED);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarkMap, setBookmarkMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [favCompaniesMap, setFavCompaniesMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FAV_COMPANIES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [notesMap, setNotesMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Listen to Browser Back / Forward buttons & Hash Changes
  useEffect(() => {
    const handleLocationChange = () => {
      const { tab, company } = parseHash(window.location.hash);
      setActiveTabState(tab);
      setSelectedCompanySlugState(company);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    if (!window.location.hash || window.location.hash === '#') {
      window.history.replaceState(null, '', '#/');
    }

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Dynamic Document Title based on Active View & Selected Company
  useEffect(() => {
    if (selectedCompanySlug) {
      const company = companies.find((c) => c.slug === selectedCompanySlug);
      const name = company ? company.name : selectedCompanySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      document.title = `${name} LeetCode Questions & Frequency Sheet (2026) | Leet Companies`;
    } else if (activeTab === 'companies') {
      document.title = 'Browse 470+ Companies LeetCode Question Sheets | Leet Companies';
    } else if (activeTab === 'search') {
      document.title = 'Multi-Company Overlap Matrix & Problem Search | Leet Companies';
    } else if (activeTab === 'tracker') {
      document.title = 'My Interview Prep Progress Tracker | Leet Companies';
    } else {
      document.title = 'Leet Companies — Free LeetCode Company Wise Questions & Frequency Tags (470+ Companies)';
    }
  }, [activeTab, selectedCompanySlug, companies]);
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [compRes, tagRes] = await Promise.all([
          fetch('./data/companies.json'),
          fetch('./data/tags.json')
        ]);
        const compData = await compRes.json();
        const tagData = await tagRes.json();
        setCompanies(compData);
        setTags(tagData);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoadingCompanies(false);
      }
    }
    loadInitialData();
  }, []);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SOLVED, JSON.stringify(solvedMap));
  }, [solvedMap]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkMap));
  }, [bookmarkMap]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FAV_COMPANIES, JSON.stringify(favCompaniesMap));
  }, [favCompaniesMap]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTES, JSON.stringify(notesMap));
  }, [notesMap]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSelectedCompanySlugState(null);
    window.location.hash = tab === 'home' ? '#/' : `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCompany = (slug) => {
    setSelectedCompanySlugState(slug);
    setActiveTabState('companies');
    window.location.hash = `#/company/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSelectedCompany = () => {
    setSelectedCompanySlugState(null);
    window.location.hash = '#/companies';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSolved = (slug) => {
    setSolvedMap((prev) => {
      const next = { ...prev };
      if (next[slug]) {
        delete next[slug];
      } else {
        next[slug] = true;
      }
      return next;
    });
  };

  const toggleBookmark = (slug) => {
    setBookmarkMap((prev) => {
      const next = { ...prev };
      if (next[slug]) {
        delete next[slug];
      } else {
        next[slug] = true;
      }
      return next;
    });
  };

  const toggleFavoriteCompany = (companySlug) => {
    setFavCompaniesMap((prev) => {
      const next = { ...prev };
      if (next[companySlug]) {
        delete next[companySlug];
      } else {
        next[companySlug] = true;
      }
      return next;
    });
  };

  const setProblemNote = (slug, note) => {
    setNotesMap((prev) => {
      const next = { ...prev };
      if (!note || note.trim() === '') {
        delete next[slug];
      } else {
        next[slug] = note.trim();
      }
      return next;
    });
  };

  const solvedCount = Object.keys(solvedMap).length;
  const bookmarkedCount = Object.keys(bookmarkMap).length;

  const value = {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    selectedCompanySlug,
    selectCompany,
    clearSelectedCompany,
    companies,
    tags,
    loadingCompanies,
    solvedMap,
    toggleSolved,
    bookmarkMap,
    toggleBookmark,
    favCompaniesMap,
    toggleFavoriteCompany,
    notesMap,
    setProblemNote,
    solvedCount,
    bookmarkedCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
