/**
 * Navigation utility functions for SvelteKit
 */

/**
 * Navigate to the previous page in browser history.
 * Falls back to a specified route if no history exists.
 * @param fallbackRoute - The route to navigate to if there's no history
 */
export function goBack(fallbackRoute: string = '/home'): void {
    if (typeof window !== 'undefined') {
        // Check if we can go back
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Fallback to specified route
            window.location.href = fallbackRoute;
        }
    }
}
