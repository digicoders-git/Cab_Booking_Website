/**
 * Central API Configuration for Backend Integration.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Base URL without /api — for images/uploads
export const BASE_SERVER_URL = API_BASE_URL.replace(/\/api$/, '');

export default API_BASE_URL;
