const container = document.querySelector('#container');
const optionsContainer = document.querySelector('#optionsContainer');
const statusEl = document.querySelector('#status');
const resultLabel = document.querySelector('#resultLabel');
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const refreshButton = document.querySelector('#refreshButton');
const savedButton = document.querySelector('#savedButton');
const savedCount = document.querySelector('#savedCount');
const themeButton = document.querySelector('#themeButton');

const country = 'in';
const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
let currentCategory = 'general';
let currentQuery = '';
let showingSaved = false;
let lastArticles = [];

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const safeUrl = (value = '') => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
  } catch { return '#'; }
};

const getSaved = () => {
  try { return JSON.parse(localStorage.getItem('savedNews') || '[]'); } catch { return []; }
};
const setSaved = (items) => localStorage.setItem('savedNews', JSON.stringify(items));
const articleId = (article) => article.url || `${article.title}-${article.publishedAt}`;

const updateSavedCount = () => { savedCount.textContent = getSaved().length; };

const formatDate = (value) => {
  if (!value) return 'Unknown date';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const fallbackImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="42" font-weight="700">PulseNews</text></svg>`)}`;

const renderSkeletons = () => {
  container.innerHTML = Array.from({ length: 6 }, () => '<article class="news-card skeleton"></article>').join('');
};

const showStatus = (message = '', type = '') => {
  statusEl.className = `status ${type}`.trim();
  statusEl.textContent = message;
};

const renderArticles = (articles) => {
  lastArticles = articles;
  const saved = getSaved();
  if (!articles.length) {
    container.innerHTML = '<div class="status info">No stories found. Try another category or search term.</div>';
    return;
  }

  container.innerHTML = articles.map((item) => {
    const id = articleId(item);
    const isSaved = saved.some((savedArticle) => articleId(savedArticle) === id);
    const title = item.title && item.title !== '[Removed]' ? item.title : 'Untitled story';
    const description = item.description || 'Open the original article to read the full story.';
    const source = item.source?.name || 'News source';
    const url = safeUrl(item.url);
    const image = item.urlToImage || fallbackImage;
    return `
      <article class="news-card">
        <img class="news-image" src="${escapeHtml(image)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}'" />
        <div class="news-content">
          <div class="news-meta"><span>${escapeHtml(source)}</span><span>${formatDate(item.publishedAt)}</span></div>
          <h2 class="news-title">${escapeHtml(title)}</h2>
          <p class="news-description">${escapeHtml(description)}</p>
          <div class="news-actions">
            <a class="view-button" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Read article ↗</a>
            <button class="save-button ${isSaved ? 'saved' : ''}" data-save-id="${escapeHtml(id)}" type="button">${isSaved ? '★ Saved' : '☆ Save'}</button>
          </div>
        </div>
      </article>`;
  }).join('');

  container.querySelectorAll('[data-save-id]').forEach((button) => {
    button.addEventListener('click', () => toggleSaved(button.dataset.saveId));
  });
};

const toggleSaved = (id) => {
  const saved = getSaved();
  const index = saved.findIndex((item) => articleId(item) === id);
  if (index >= 0) saved.splice(index, 1); else {
    const article = lastArticles.find((item) => articleId(item) === id);
    if (article) saved.unshift(article);
  }
  setSaved(saved.slice(0, 50));
  updateSavedCount();
  if (showingSaved) renderArticles(getSaved()); else renderArticles(lastArticles);
};

const fetchNews = async () => {
  showingSaved = false;
  renderSkeletons();
  showStatus('');
  refreshButton.disabled = true;
  let url;
  try {
    if (!apiKey) throw new Error('MISSING_KEY');
    if (currentQuery) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(currentQuery)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${encodeURIComponent(apiKey)}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${currentCategory}&pageSize=30&apiKey=${encodeURIComponent(apiKey)}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok || data.status !== 'ok') throw new Error(data.message || `Request failed (${response.status})`);
    const articles = (data.articles || []).filter((item) => item.title && item.url);
    resultLabel.textContent = currentQuery ? `Results for “${currentQuery}”` : `${currentCategory} headlines`;
    renderArticles(articles);
  } catch (error) {
    console.error(error);
    container.innerHTML = '';
    if (error.message === 'MISSING_KEY') {
      showStatus('NewsAPI key not configured. Add NEWS_API_KEY in your Vercel environment variables, or set localStorage.newsApiKey for local testing.', 'info');
    } else {
      showStatus('Unable to load news right now. Check the API key, API plan limits, and network connection.', 'error');
    }
  } finally { refreshButton.disabled = false; }
};

const renderCategories = () => {
  optionsContainer.innerHTML = categories.map((category) => `
    <button class="option ${category === currentCategory && !currentQuery ? 'active' : ''}" type="button" data-category="${category}">${category}</button>`).join('');
  optionsContainer.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => {
    currentCategory = button.dataset.category;
    currentQuery = '';
    searchInput.value = '';
    renderCategories();
    fetchNews();
  }));
};

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) { currentQuery = ''; fetchNews(); return; }
  currentQuery = query;
  optionsContainer.querySelectorAll('.option').forEach((button) => button.classList.remove('active'));
  fetchNews();
});

refreshButton.addEventListener('click', fetchNews);

savedButton.addEventListener('click', () => {
  showingSaved = !showingSaved;
  if (showingSaved) {
    resultLabel.textContent = 'Saved stories';
    renderArticles(getSaved());
  } else fetchNews();
});

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? '☀' : '☾';
  localStorage.setItem('newsTheme', theme);
};
themeButton.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('newsTheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);
  renderCategories();
  updateSavedCount();
  fetchNews();
});
