const container = document.querySelector('.container');
const optionsContainer = document.querySelector('.options-container');
const country = 'in';
const options = ['general','entertainment','health','science','sports','technology'];
let requestURL;

const generateUI = (articles) => {
  if (!articles.length) {
    container.innerHTML = '<p class="empty-state">No news articles were returned for this category.</p>';
    return;
  }
  for (const item of articles) {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.innerHTML = `<div class="news-image-container"><img src="${item.urlToImage || './newspaper.jpg'}" alt="" loading="lazy" onerror="this.src='./newspaper.jpg'"></div><div class="news-content"><div class="news-title"></div><div class="news-description"></div><a href="${item.url}" target="_blank" rel="noopener noreferrer" class="view-button">Read More</a></div>`;
    card.querySelector('.news-title').textContent = item.title || 'Untitled article';
    card.querySelector('.news-description').textContent = item.description || item.content || 'No description available.';
    container.appendChild(card);
  }
};

const getNews = async () => {
  container.innerHTML = '<p class="empty-state">Loading latest news…</p>';
  if (!apiKey) {
    container.innerHTML = '<div class="empty-state"><strong>NewsAPI key required.</strong><br>For local use, open DevTools and run:<br><code>localStorage.setItem("newsApiKey", "YOUR_KEY")</code><br>Then reload the page.</div>';
    return;
  }
  try {
    const response = await fetch(requestURL);
    if (!response.ok) throw new Error(`News API returned ${response.status}`);
    const data = await response.json();
    if (data.status !== 'ok') throw new Error(data.message || 'News request failed');
    container.innerHTML = '';
    generateUI(data.articles || []);
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p class="empty-state">News is temporarily unavailable. Check your API key and try again.</p>';
  }
};

const selectCategory = (event, category) => {
  document.querySelectorAll('.option').forEach((element) => element.classList.remove('active'));
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${encodeURIComponent(apiKey)}`;
  event.currentTarget.classList.add('active');
  getNews();
};

const createOptions = () => {
  optionsContainer.innerHTML = options.map(category => `<button class="option ${category === 'general' ? 'active' : ''}" type="button" data-category="${category}">${category}</button>`).join('');
  optionsContainer.querySelectorAll('.option').forEach(button => button.addEventListener('click', event => selectCategory(event, button.dataset.category)));
};

window.addEventListener('load', () => {
  requestURL = `https://newsapi.org/v2/top-headlines?country=${country}&category=general&apiKey=${encodeURIComponent(apiKey)}`;
  createOptions();
  getNews();
});
