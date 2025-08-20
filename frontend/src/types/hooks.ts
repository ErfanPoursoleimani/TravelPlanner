export interface CookieOptions {
  expires?: Date | number;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

// User preferences type (customize as needed)
export interface UserPreferences {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: boolean;
  [key: string]: any;
}

// Return type for the hook
export interface UseCookiesReturn {
  // State
  cookies: Record<string, string>;
  
  // Basic operations
  getCookie: (name: string) => string | null;
  setCookie: (name: string, value: string, options?: CookieOptions) => void;
  removeCookie: (name: string, options?: Omit<CookieOptions, 'expires'>) => void;
  
  // Django-specific
  getCSRFToken: () => string | null;
  getSessionId: () => string | null;
  
  // Authentication helpers
  setAuthToken: (token: string, options?: CookieOptions) => void;
  getAuthToken: () => string | null;
  removeAuthToken: () => void;
  isAuthenticated: () => boolean;
  
  // User preferences
  setUserPreferences: (preferences: UserPreferences, options?: CookieOptions) => void;
  getUserPreferences: () => UserPreferences | null;
  
  // Utility
  clearAllCookies: () => void;
}