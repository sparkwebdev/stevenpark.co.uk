/**
 * Level 1 Pages - Main site pages for visual regression testing
 * These are the core pages that should always be tested
 */

export const pages = [
  // Main navigation pages
  {
    path: '/',
    name: 'home'
  },
  {
    path: '/work/',
    name: 'work'
  },
  {
    path: '/contact/',
    name: 'contact'
  },

  // Core about pages
  {
    path: '/about/',
    name: 'about'
  },
  {
    path: '/about/testimonials/',
    name: 'testimonials'
  },
  {
    path: '/about/faqs/',
    name: 'faqs'
  },

  // Work sub-pages
  {
    path: '/work/services/',
    name: 'services'
  },
  {
    path: '/work/tools/',
    name: 'tools'
  },

  // Featured portfolio items
  {
    path: '/work/efundamentals/',
    name: 'efundamentals'
  },
  {
    path: '/work/forth-valley-art-beat/',
    name: 'forth-valley-art-beat'
  },
  {
    path: '/work/bandstands/',
    name: 'bandstands'
  },

  // Utility pages
  {
    path: '/404.html',
    name: '404'
  },
  {
    path: '/sitemap.html',
    name: 'sitemap'
  }
];