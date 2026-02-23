// WEMBA Pathway Planner - Hash-based Router
// Provides URL-based routing for seamless navigation

const ROUTES = {
  '/': { view: null, screen: 'cohort-selection' },
  '/dashboard': { view: 'dashboard', screen: 'main-app' },
  '/explorer': { view: 'explorer', screen: 'main-app' },
  '/pathway': { view: 'pathway', screen: 'main-app' },
  '/graph': { view: 'graph', screen: 'main-app' }
};

class Router {
  constructor() {
    this.currentRoute = '/';
    this.callbacks = [];
    this.init();
  }

  init() {
    // Listen for hash changes (back/forward buttons)
    window.addEventListener('hashchange', () => this.handleRouteChange());

    // Handle initial route on page load
    window.addEventListener('DOMContentLoaded', () => {
      // Don't navigate on initial load - let app.js handle initial state
      // This allows cohort selection to show if no cohort is selected
    });
  }

  /**
   * Navigate to a new route
   * @param {string} path - The route path (e.g., '/dashboard')
   * @param {object} options - Navigation options
   * @param {boolean} options.replace - Replace current history entry instead of pushing
   */
  navigate(path, options = {}) {
    // Normalize path
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Validate route exists
    if (!ROUTES[path]) {
      console.warn(`Unknown route: ${path}, falling back to /dashboard`);
      path = '/dashboard';
    }

    // Update URL hash
    if (options.replace) {
      window.location.replace('#' + path);
    } else {
      window.location.hash = path;
    }
  }

  /**
   * Handle route changes from hash updates
   */
  handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    const route = ROUTES[hash];

    if (!route) {
      // Unknown route - redirect to dashboard if cohort selected, otherwise landing
      this.navigate('/dashboard', { replace: true });
      return;
    }

    this.currentRoute = hash;

    // Mobile redirect: Graph Builder not supported on mobile
    if (hash === '/graph' && window.matchMedia('(max-width: 768px)').matches) {
      this.navigate('/pathway', { replace: true });
      return;
    }

    // Route guard: redirect to landing if accessing app without cohort
    if (route.screen === 'main-app' && typeof state !== 'undefined' && !state.selectedCohort) {
      this.navigate('/', { replace: true });
      return;
    }

    // Notify callbacks
    this.callbacks.forEach(cb => cb(route, hash));
  }

  /**
   * Register a callback for route changes
   * @param {function} callback - Function to call with (route, path)
   */
  onRouteChange(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Get current route info
   * @returns {object} Current route configuration
   */
  getCurrentRoute() {
    const hash = window.location.hash.slice(1) || '/';
    return ROUTES[hash] || ROUTES['/'];
  }

  /**
   * Get current path
   * @returns {string} Current path
   */
  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  }

  /**
   * Check if we're on a specific route
   * @param {string} path - Path to check
   * @returns {boolean}
   */
  isRoute(path) {
    return this.getCurrentPath() === path;
  }
}

// Create global router instance
const router = new Router();

// Make available globally
window.router = router;
