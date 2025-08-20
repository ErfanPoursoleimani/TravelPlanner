import { useState, useEffect, useCallback } from 'react';
import type { UseCookiesReturn, UserPreferences, CookieOptions } from '../types/hooks';

const useCookies = (): UseCookiesReturn => {
  const [cookies, setCookies] = useState<Record<string, string>>({});

  // Parse all cookies from document.cookie
  const parseCookies = useCallback((): Record<string, string> => {
    const cookieObj: Record<string, string> = {};
    if (typeof document !== 'undefined' && document.cookie) {
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookieObj[name] = decodeURIComponent(value);
        }
      });
    }
    return cookieObj;
  }, []);

  // Get a specific cookie value
  const getCookie = useCallback((name: string): string | null => {
    const cookieValue = parseCookies()[name];
    return cookieValue || null;
  }, [parseCookies]);

  // Set a cookie with various options
  const setCookie = useCallback((
    name: string, 
    value: string, 
    options: CookieOptions = {}
  ): void => {
    if (typeof document === 'undefined') return;

    const {
      expires,
      maxAge,
      domain,
      path = '/',
      secure = window.location.protocol === 'https:',
      sameSite = 'lax',
      httpOnly = true
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
      if (expires instanceof Date) {
        cookieString += `; expires=${expires.toUTCString()}`;
      } else if (typeof expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
      }
    }

    if (maxAge) cookieString += `; max-age=${maxAge}`;
    if (domain) cookieString += `; domain=${domain}`;
    if (path) cookieString += `; path=${path}`;
    if (secure) cookieString += `; secure`;
    if (sameSite) cookieString += `; samesite=${sameSite}`;
    if (httpOnly) cookieString += `; httponly`;

    document.cookie = cookieString;
    
    // Update state
    setCookies(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Remove a cookie
  const removeCookie = useCallback((
    name: string, 
    options: Omit<CookieOptions, 'expires'> = {}
  ): void => {
    setCookie(name, '', {
      ...options,
      expires: new Date(0)
    });
    
    setCookies(prev => {
      const newCookies = { ...prev };
      delete newCookies[name];
      return newCookies;
    });
  }, [setCookie]);

  // Django-specific: Get CSRF token
  const getCSRFToken = useCallback((): string | null => {
    return getCookie('csrftoken');
  }, [getCookie]);

  // Django-specific: Get session ID
  const getSessionId = useCallback((): string | null => {
    return getCookie('sessionid');
  }, [getCookie]);

  // Set authentication token (common pattern)
  const setAuthToken = useCallback((
    token: string, 
    options: CookieOptions = {}
  ): void => {
    const defaultOptions: CookieOptions = {
      expires: 7, // 7 days
      secure: true,
      sameSite: 'strict',
      ...options
    };
    setCookie('auth-token', token, defaultOptions);
  }, [setCookie]);

  // Get authentication token
  const getAuthToken = useCallback((): string | null => {
    return getCookie('auth-token');
  }, [getCookie]);

  // Remove authentication token
  const removeAuthToken = useCallback((): void => {
    removeCookie('auth-token');
  }, [removeCookie]);

  // Check if user is authenticated (based on token existence) 
  // This needs to change
  const isAuthenticated = useCallback((): boolean => {
    return !!getAuthToken();
  }, [getAuthToken]);

  // Set user preferences (JSON serialized)
  const setUserPreferences = useCallback((
    preferences: UserPreferences, 
    options: CookieOptions = {}
  ): void => {
    const defaultOptions: CookieOptions = {
      expires: 365, // 1 year
      ...options
    };
    setCookie('userPrefs', JSON.stringify(preferences), defaultOptions);
  }, [setCookie]);

  // Get user preferences
  const getUserPreferences = useCallback((): UserPreferences | null => {
    const prefs = getCookie('userPrefs');
    try {
      return prefs ? JSON.parse(prefs) : null;
    } catch (error) {
      console.error('Error parsing user preferences:', error);
      return null;
    }
  }, [getCookie]);

  // Clear all cookies (logout scenario)
  const clearAllCookies = useCallback((): void => {
    Object.keys(parseCookies()).forEach(cookieName => {
      removeCookie(cookieName);
    });
    setCookies({});
  }, [parseCookies, removeCookie]);

  // Update cookies state on mount and when cookies change
  useEffect(() => {
    setCookies(parseCookies());
    
    // Optional: Listen for storage events (if cookies are modified in other tabs)
    const handleStorageChange = (): void => {
      setCookies(parseCookies());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [parseCookies]);

  return {
    // State
    cookies,
    
    // Basic operations
    getCookie,
    setCookie,
    removeCookie,
    
    // Django-specific
    getCSRFToken,
    getSessionId,
    
    // Authentication helpers
    setAuthToken,
    getAuthToken,
    removeAuthToken,
    isAuthenticated,
    
    // User preferences
    setUserPreferences,
    getUserPreferences,
    
    // Utility
    clearAllCookies
  };
};

export default useCookies;