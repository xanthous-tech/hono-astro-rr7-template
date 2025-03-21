export const API_URL = process.env.PUBLIC_API_URL ?? 'http://localhost:3000';
export const APP_URL = process.env.APP_URL ?? 'http://localhost:4321';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const APP_STAGE = APP_URL.includes('localhost')
  ? 'development'
  : 'production';

// notice the `.` before the domain for wildcard subdomains
export const COOKIE_DOMAIN = IS_PROD ? '.example.com' : undefined;
