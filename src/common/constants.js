export const API_BASE_URL = 'https://v2.api.noroff.dev';

export const API_LOGIN_URL = `${API_BASE_URL}/auth/login`;
export const API_REGISTER_URL = `${API_BASE_URL}/auth/register`;
export const API_VENUES_URL = `${API_BASE_URL}/holidaze/venues`;
export const API_PROFILES_URL = `${API_BASE_URL}/holidaze/profiles`;
export const API_BOOKINGS_URL = `${API_BASE_URL}/holidaze/bookings`;
export const API_KEY = process.env.REACT_APP_API_KEY;