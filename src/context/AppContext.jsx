import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const LOCAL_STORAGE_KEYS = {
  THEME: 'lc_explorer_theme',
  SOLVED: 'lc_explorer_solved',
  BOOKMARKS: 'lc_explorer_bookmarks',
  FAV_COMPANIES: 'lc_explorer_fav_companies',
  NOTES: 'lc_explorer_notes',
};

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) || 'dark';
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState('companies'); // 'companies' | 'search' | 'overlap' | 'tracker'
  const [selectedCompanySlug, setSelectedCompanySlug] = useState(null);

  // Global Companies metadata
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // User tracking states
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

  // Synchronize theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Load companies index and tags on mount
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

  // Save changes to localStorage
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

  // Helper Actions
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
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

  const selectCompany = (slug) => {
    setSelectedCompanySlug(slug);
    setActiveTab('companies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSelectedCompany = () => {
    setSelectedCompanySlug(null);
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
