/**
 * Locale Service
 * Handles user locale preferences and persistence
 */

import { Locale } from '@/i18n/config';

/**
 * Set user locale preference
 * This function should handle locale switching logic
 */
export async function setUserLocale(locale: Locale): Promise<void> {
  try {
    // Store locale in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-locale', locale);
    }

    // Set cookie for server-side rendering with proper attributes
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax; Secure=${location.protocol === 'https:'}`;
    }

    // For Next.js 13+ app directory, we can use window.location.pathname and router
    // to navigate to the new locale path instead of reloading
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const currentHash = window.location.hash;
      
      // Remove current locale from path if it exists
      const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2,3}/, '') || '/';
      
      // Navigate to new locale path
      const newPath = `/${locale}${pathWithoutLocale}${currentSearch}${currentHash}`;
      window.location.href = newPath;
    }
  } catch (error) {
    console.error('Failed to set user locale:', error);
    throw new Error('Failed to update locale preference');
  }
}

/**
 * Get user locale preference from localStorage
 */
export function getUserLocale(): Locale | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedLocale = localStorage.getItem('user-locale') as Locale;
    return storedLocale || null;
  } catch (error) {
    console.error('Failed to get user locale:', error);
    return null;
  }
}

/**
 * Get locale from cookie (for server-side usage)
 */
export function getLocaleFromCookie(cookieString?: string): Locale | null {
  if (!cookieString) return null;

  try {
    const cookies = cookieString.split(';');
    const localeCookie = cookies.find(cookie => 
      cookie.trim().startsWith('NEXT_LOCALE=')
    );

    if (localeCookie) {
      const locale = localeCookie.split('=')[1]?.trim();
      return locale as Locale;
    }

    return null;
  } catch (error) {
    console.error('Failed to parse locale from cookie:', error);
    return null;
  }
}

/**
 * Server-safe locale detection
 * For use in server-side contexts like Next.js middleware or API routes
 */
export function getServerLocale(request?: { headers?: { cookie?: string } }): Locale {
  const { defaultLocale } = require('@/i18n/config');
  
  try {
    // Try to get from request cookies
    if (request?.headers?.cookie) {
      const cookieLocale = getLocaleFromCookie(request.headers.cookie);
      if (cookieLocale && isValidLocale(cookieLocale)) {
        return cookieLocale;
      }
    }
    
    // Fall back to default locale
    return defaultLocale;
  } catch (error) {
    console.error('Failed to get server locale:', error);
    return defaultLocale;
  }
}

/**
 * Clear user locale preference
 */
export function clearUserLocale(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-locale');
    }

    // Clear cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'NEXT_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  } catch (error) {
    console.error('Failed to clear user locale:', error);
  }
}

/**
 * Validate if a locale string is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  const { locales } = require('@/i18n/config');
  return locales.includes(locale as Locale);
}

/**
 * Get browser's preferred locale that matches our supported locales
 */
export function getBrowserLocale(): Locale | null {
  if (typeof window === 'undefined') return null;

  try {
    const browserLocales = navigator.languages || [navigator.language];
    const { locales } = require('@/i18n/config');
    
    for (const browserLocale of browserLocales) {
      // Try exact match first
      const exactMatch = browserLocale.toLowerCase();
      if (locales.includes(exactMatch)) {
        return exactMatch as Locale;
      }
      
      // Try language code only (e.g., 'en' from 'en-US')
      const langCode = browserLocale.split('-')[0].toLowerCase();
      if (locales.includes(langCode)) {
        return langCode as Locale;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get browser locale:', error);
    return null;
  }
}

/**
 * Get the best available locale for the user
 * Priority: stored preference > browser preference > default
 */
export function getPreferredLocale(): Locale {
  const { defaultLocale } = require('@/i18n/config');
  
  // Check stored preference first
  const storedLocale = getUserLocale();
  if (storedLocale && isValidLocale(storedLocale)) {
    return storedLocale;
  }
  
  // Check browser preference
  const browserLocale = getBrowserLocale();
  if (browserLocale && isValidLocale(browserLocale)) {
    return browserLocale;
  }
  
  // Fall back to default
  return defaultLocale;
}
