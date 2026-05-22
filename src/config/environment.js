// Centralized access to environment variables
// Import this instead of using import.meta.env directly throughout the app

export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: import.meta.env.VITE_APP_NAME,
  env: import.meta.env.VITE_ENV,
  isDevelopment: import.meta.env.VITE_ENV === 'development',
  isProduction: import.meta.env.VITE_ENV === 'production',
}
