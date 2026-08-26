# 📰 News App

A responsive India-focused news dashboard built with vanilla JavaScript and NewsAPI.

## Features

- India top headlines
- General, entertainment, health, science, sports and technology categories
- Responsive news cards
- Dark-mode widget
- Lazy-loaded images with fallback handling
- Safe DOM rendering for article text
- Clear loading and error states
- No API secret committed to the repository

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- NewsAPI

## Configure the API key

The repository intentionally does **not** contain a real API key.

For local development, open the browser console and run:

```js
localStorage.setItem('newsApiKey', 'YOUR_NEWSAPI_KEY')
```

Then reload the page.

If the old exposed key was ever active, revoke/rotate it in the NewsAPI account before using this project again.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Deployment

For a production deployment, use a backend/serverless function to keep API credentials out of browser code. A purely static deployment should be treated as a demo because browser-side API keys can be inspected by users.
