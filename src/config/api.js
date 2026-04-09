/**
 * Central API Configuration for Backend Integration.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Uploads/static files ke liye — /api ke bina
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

export default API_BASE_URL;
