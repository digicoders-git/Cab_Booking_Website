/**
 * Central API Configuration for Backend Integration.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// /api ko end se hatao — chahe local ho ya production
export const BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export default API_BASE_URL;
