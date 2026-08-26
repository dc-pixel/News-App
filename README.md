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

For the deployed version, create a Vercel project from this GitHub repository and add the environment variable `NEWS_API_KEY` in **Project Settings → Environment Variables**.

> Current front-end code still reads the key client-side for compatibility with the original static architecture. That means the key can be inspected by visitors and should be treated as a demo/browser key. For a fully secure production application, move NewsAPI requests behind a Vercel Function or another server-side proxy.

## 🚀 Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## ☁️ Deploy to Vercel

1. Open Vercel and choose **Add New → Project**.
2. Import `dc-pixel/News-App` from GitHub.
3. Leave the framework/build settings as the default static-site settings.
4. Add `NEWS_API_KEY` to the Production environment variables.
5. Deploy.

Vercel will serve the HTML/CSS/JavaScript files directly. The repository already includes `vercel.json` with basic security headers.

## 📌 Important

Never commit a real NewsAPI key into `api-key.js` or Git history. If a previously exposed key was active, revoke/rotate it in the NewsAPI account before using it again.
