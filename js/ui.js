// here everything that changes the page: spinner, alerts, popup card and so


import { $, capitalize , iconUrl, placeLabel } from './helpers.js';
import {getApiKey, saveApiKey, clearApiKey } from './storage.js';

// ________________________________________________________________________________
// ________________________________________________________________________________
//API key setup 
function updateKeyState() {
  const hasKey = getApiKey() !== '';
  $('#key-state').textContent = hasKey ? 'Key saved for this session' : 'No key yet';
  $('#key-state').classList.toggle('ok', hasKey);
  $('#key-remove').hidden = !hasKey;
}

export function openKeyDialog() {
  $('#key-input').value = '';
  $('#key-msg').textContent = '';
  updateKeyState();
  $('#key-dialog').showModal();
}

export function initKeyDialog() {
  updateKeyState();
  $('#key-btn').addEventListener('click', openKeyDialog);
  $('#key-cancel').addEventListener('click', () => $('#key-dialog').close());

  $('#key-remove').addEventListener('click', () => {
    clearApiKey();
    updateKeyState();
    $('#key-dialog').close();
  });

  $('#key-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const key = $('#key-input').value.trim();
    if (key.length < 16) {
      $('#key-msg').textContent = 'Please enter a valid API key (OpenWeatherMap keys have 32 characters).';
      return;
    }
    saveApiKey(key);
    updateKeyState();
    $('#key-dialog').close();
  });
}


// ________________________________________________________________________________
// ________________________________________________________________________________
// Loading spinner
export function showLoading(isLoading) {
  $('#loader').hidden = !isLoading;
  $('#search-btn').disabled = isLoading;
}

// ________________________________________________________________________________
// ________________________________________________________________________________
//Error cards 
export function clearError() {
  $('#alert-area').innerHTML = '';
}

export function showError(message) {
  clearError();
  const card = document.createElement('div');
  card.className = 'alert';
  card.setAttribute('role', 'alert');

  const text = document.createElement('span');
  text.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'alert-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', clearError);

  card.append(text, closeBtn);
  $('#alert-area').append(card);
}

// ________________________________________________________________________________
// ________________________________________________________________________________
//Popup card on the map
export function buildPopup(place, w, {onShare, onCopy, onFavorite, isFavorite }) {
  const box = document.createElement('div');
  box.className = 'popup';
  box.innerHTML = `
    <h3 class="popup-title">${placeLabel(place)}</h3>
    <div class="popup-main">
      <img class="popup-icon" src="${iconUrl(w.weather[0].icon)}" alt="${w.weather[0].description}">
      <span class="popup-temp">${Math.round(w.main.temp)}°C</span>
    </div>
    <p class="popup-desc">${capitalize(w.weather[0].description)}</p>
    <ul class="popup-list">
      <li><span>Clouds</span><strong>${w.clouds.all}%</strong></li>
      <li><span>Humidity</span><strong>${w.main.humidity}%</strong></li>
      <li><span>Wind</span><strong>${w.wind.speed} m/s</strong></li>
      <li><span>Feels like</span><strong>${Math.round(w.main.feels_like)}°C</strong></li>
    </ul>
    <div class="popup-actions">
      <button type="button" class="btn btn-fb share-btn">Share on Facebook</button>
      <button type="button" class="btn btn-soft copy-btn">Copy weather text</button>
      <button type="button" class="btn btn-soft fav-btn"></button>
    </div>
    `;

    // for facebook share btn
    box.querySelector('.share-btn').addEventListener('click', onShare);
    // copy weather btn
    const copyBtn = box.querySelector('.copy-btn');
    copyBtn.addEventListener('click', async () => {
    copyBtn.textContent = (await onCopy()) ? 'Copied!' : 'Copy failed';
    setTimeout(() => { copyBtn.textContent = 'Copy weather text'; }, 2000);
    });
    // for adding favorite city
    const favBtn = box.querySelector('.fav-btn');
    const showFavText = (saved) => { favBtn.textContent = saved ? '★ Saved' : '☆ Add to favorites'; };
    showFavText(isFavorite);
    favBtn.addEventListener('click', () => showFavText(onFavorite()));

  return box;
}


// ________________________________________________________________________________
// ________________________________________________________________________________
//Favorites / history chips 
export function renderChips(container, places, emptyText, onSelect, onRemove) {
  container.innerHTML = '';
  if (places.length === 0) {
    container.innerHTML = `<p class="empty">${emptyText}</p>`;
    return;
  }
  places.forEach((place) => {
    const wrap = document.createElement('span');
    wrap.className = 'chip-wrap';

    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = placeLabel(place);
    chip.addEventListener('click', () => onSelect(place));
    wrap.append(chip);

    if (onRemove) { // favorites have a small x button to remove them
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'chip-x';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => onRemove(place));
      wrap.append(removeBtn);
    }
    container.append(wrap);
  });
}
