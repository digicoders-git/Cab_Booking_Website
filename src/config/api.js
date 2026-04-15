/**
 * Central API Configuration for Backend Integration.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/api$/, '');

// /api ko end se hatao — chahe local ho ya production (This is now redundant but kept for BASE_URL consistency)
export const BASE_URL = API_BASE_URL;

export default API_BASE_URL;
