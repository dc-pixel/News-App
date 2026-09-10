// Local configuration only. Never commit a real API key.
// Copy this value from your NewsAPI account for local development.
let apiKey = '';

try {
  apiKey = localStorage.getItem('newsApiKey') || '';
} catch (error) {
  console.warn('Unable to read local NewsAPI key from browser storage', error);
}
