# 📰 PulseNews

A polished, responsive India-focused news dashboard built with vanilla JavaScript and NewsAPI.

## ✨ Features

- 🇮🇳 India top headlines
- 7 news categories: general, business, entertainment, health, science, sports and technology
- 🔎 Keyword search with NewsAPI's Everything endpoint
- ⭐ Save articles to localStorage
- 🌙 Persistent dark/light theme
- ⚡ Skeleton loading and refresh controls
- 🖼️ Lazy-loaded article images with fallback graphics
- 📱 Responsive 1/2/3-column layout
- ♿ Accessible buttons, labels and live status messaging
- 🛡️ Safer DOM rendering and basic security headers via `vercel.json`
- 🔐 No real API secret committed to GitHub

## 🧰 Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- NewsAPI
- Vercel

## 🔑 Configure NewsAPI

The repository intentionally does **not** contain a real API key.

### Local development

Open the browser console and run:

```js
localStorage.setItem('newsApiKey', 'YOUR_NEWSAPI_KEY')
```

Then reload the page.

### Vercel deployment

This project is a static frontend, so browser JavaScript cannot read a Vercel environment variable directly. The current implementation reads `localStorage.newsApiKey`, not `NEWS_API_KEY` from the Vercel environment.

For the current static architecture, configure the key in the browser after deployment using the same `localStorage` command above. Treat the key as a **public browser-side key**, because it will be included in requests made from the visitor's browser.

If you need the API key to remain private, the application must be changed to send NewsAPI requests through a server-side endpoint such as a Vercel Function. Only that server-side endpoint should read `NEWS_API_KEY` from Vercel environment variables.

## 🚀 Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## ☁️ Deploy to Vercel

1. Open Vercel and choose **Add New → Project**.
2. Import `dc-pixel/News-App` from GitHub.
3. Leave the framework/build settings as the default static-site settings.
4. Deploy.
5. After deployment, configure the browser-side NewsAPI key with:

```js
localStorage.setItem('newsApiKey', 'YOUR_NEWSAPI_KEY')
```

Vercel will serve the HTML/CSS/JavaScript files directly. The repository already includes `vercel.json` with basic security headers.

## 📌 Important

Never commit a real NewsAPI key into `api-key.js` or Git history. Because the current application makes NewsAPI requests directly from the browser, any configured key should be treated as exposed to users. If a previously exposed key was active, revoke/rotate it in the NewsAPI account before using it again.
