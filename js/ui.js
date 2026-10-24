/**
 *  this file everything that changes the page: spinner, alerts, popup card and so
*/ 


import { $, capitalize , iconUrl, placeLabel , dayLabel} from './helpers.js';
import {getApiKey, saveApiKey, clearApiKey } from './storage.js';

// ________________________________________________________________________________
// ________________________________________________________________________________
//API key setup 

// updates the displayed status of the key according to if there is key stored or not
// need no parameters and return nothing
function updateKeyState() {
  const hasKey = getApiKey() !== ''; //true if thre is key stored, false if no key stored
  $('#key-state').textContent = hasKey ? 'Key saved for this session' : 'No key yet';
  $('#key-state').classList.toggle('ok', hasKey); //add class "ok" for this element if hasKey is true, if it false then remove class "ok" form it
  $('#key-remove').hidden = !hasKey; //display the remove key button only if no key stored
}

// open the dialog window with clean state. uses it on this file but exported so app.js call it if user tryed to search without key.
// need no parameters and return nothing
export function openKeyDialog() {
  $('#key-input').value = '';
  $('#key-msg').textContent = '';
  updateKeyState();
  $('#key-dialog').showModal(); //opens the <dialog> on modal mode to let user focus on it
}

// this function to record dialog window events. it called once when the application starts
// need no parameters and return nothing
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
    const key = $('#key-input').value.trim(); //trim() to remove extra spaces
    if (key.length < 16) {
      $('#key-msg').textContent = 'Please enter a valid API key (OpenWeatherMap keys have 32 characters).';
      return;
    }
    const saved = saveApiKey(key);
    if(!saved){
       $('#key-msg').textContent = 'Could not save the key, yur browser blocking the storage(private mode maybe?). please alow site data or use normal windw.';
       return;
    }
    updateKeyState();
    $('#key-dialog').close();
  });
}


// ________________________________________________________________________________
// ________________________________________________________________________________
// Loading spinner

// this function useing to display the spinner and disables the search button while the request in progress
// calling showLoading(true) before the request, and showLoading(false) called in the finally block
// parameter "isLoading" is boolean value
// return nothing
export function showLoading(isLoading) {
  $('#loader').hidden = !isLoading; 
  $('#search-btn').disabled = isLoading; //to pervent repeated clicks that send duplicate requests
}

// ________________________________________________________________________________
// ________________________________________________________________________________
//Error cards

// clears the alert are with clearing innerHTML, 
// using it before showing another error and when the request for search start
// need no parameters and return nothing
export function clearError() {
  $('#alert-area').innerHTML = '';
}

// create a user friendly error message instead of logging the error to the console
// parameter "message" is a string, its the error message that api.js throwed 
// return nothing
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

// this function used to build full popup card to display on the place on the map.
// parameters; "place" is object for location have its[name,country,lat,lon], "w" is weather objecy came from getweather 
//    the third parameter is object that directly destructed into:
//      "onShare" a function that executed when facebook button clicked
//      "onCopy" asynchronous function that return true or false 
//      "onFavorite" function return true if the place marked as favorite
//      "isFavorite" boolean value, that determine the initial display/state of the favorite button
// returns element that ready to use, that app.js pass to showPlace in map .js as popup content
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
  copyBtn.addEventListener('click', async () => { //async cuz it waits for onCopy
    copyBtn.textContent = (await onCopy()) ? 'Copied!' : 'Copy failed'; 
    setTimeout(() => { copyBtn.textContent = 'Copy weather text'; }, 2000); //display the original text after two seconds
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

// this a single function used for both favorites and history, will let favorites have a delete button but the history dont have
// parameters; "container" the element whaere the buttons will be placed 
//        "places" an array of places
//        "emptyText" a text displayed when there ar no items
//        "onSelect(place)" a function that run when the button clicked 
//        "onRemove(place)" its optional to pass , if passes then  "×" button will appear for each item
// returns nothing
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


// ________________________________________________________________________________
// ________________________________________________________________________________
//Suggestions

//this function used to hide the list and clear it
// need no parameters and return nothing
export function hideSuggestions() {
  $('#suggestions').hidden = true;
  $('#suggestions').innerHTML = '';
}

// this function to full the suggestions list below the search field
// parameters; "places" is the suggest results, an array of geocoding objects.  
//        "onPick" is function that executed when a suggestion is selected
// returns nothing
export function renderSuggestions(places, onPick) {
  const box = $('#suggestions');
  box.innerHTML = '';
  if (places.length === 0) {
    box.hidden = true;
    return;
  }
  places.forEach((place) => {
    const item = document.createElement('li');
    item.textContent = `${place.name}, ${place.state ? place.state + ', ' : ''}${place.country}`;
    item.addEventListener('click', () => onPick({ 
      name: place.name, country: place.country, lat: place.lat, lon: place.lon 
    }));
    box.append(item);
  });
  box.hidden = false;
}


// ________________________________________________________________________________
// ________________________________________________________________________________
//5 days forecast

// this function used to display the cards for the five days forecasts
// parameters; "place" is the location object. "days" is the array returned by 'groubDaily' where each element is{date,min,max,icon,desc}
// return nothing
export function renderForecast(place, days) {
  $('#forecast').hidden = false;
  $('#forecast-title').textContent = `five days forecast for ${placeLabel(place)}`;
  $('#forecast-cards').innerHTML = days.map((day) => `
    <div class="day">
      <strong>${dayLabel(day.date)}</strong>
      <img src="${iconUrl(day.icon)}" alt="${day.desc}">
      <div><span class="maxTemp">${Math.round(day.max)}°</span> / <span class="minTemp">${Math.round(day.min)}°</span></div>
    </div>`).join('');
}