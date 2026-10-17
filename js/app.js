//the main file to run the app

import { initMap, showPlace  } from './map.js';
import * as ui from './ui.js'; 
import { $, placeLabel, debounce } from './helpers.js';
import * as store from './storage.js';
import { geocode, getWeather , suggest  } from './api.js';
import { shareOnFacebook, copyWeatherText } from './share.js';





const form = $('#search-form');
const input = $('#city');

let loading = false;



// Run the search for city
async function run(getPlace) {
  if (loading) return;

  if (!store.getApiKey()) {
    ui.showError('Please add your OpenWeatherMap API key first (click "API key setup").');
    ui.openKeyDialog();
    return;
  }

  loading = true;
  ui.clearError();
  ui.hideSuggestions();
  ui.showLoading(true);

  try {
    const place = await getPlace();                            // finds the coordinates, gives the place info [name, lat, lon]
    const weather = await getWeather(place.lat, place.lon);    // get current weather
    const popup = ui.buildPopup(place, weather, {
      onShare: () => shareOnFacebook(place, weather),
      onCopy: () => copyWeatherText(place, weather),
      isFavorite: store.isFavorite(place),
      onFavorite: () => {
        const saved = store.toggleFavorite(place);
        showLists();
        return saved;
      },
    });
    showPlace(place, popup);
    store.addHistory(place);
    showLists();
    input.value = placeLabel(place);

  } catch (error) {
    ui.showError(error.message); // showing the problem in an error card
  } finally {
    loading = false;
    ui.showLoading(false);
  }
}

// event listener for get weather button to get the weather for the city 
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading
  const text = input.value.trim();
  if (text === '') {
    ui.showError('Please type a city name first.');
    return;
  }
  run(() => geocode(text));
});


// ____________________________________________________________________________________________
// ____________________________________________________________________________________________
//Favorites 
const openPlace = (place) => run(() => place);

function showLists() {
  ui.renderChips($('#favorites'), store.getFavorites(), 'No favorites yet.', openPlace, (place) => {
    store.toggleFavorite(place); // to remove from favorites
    showLists();
  });
  ui.renderChips($('#history'), store.getHistory(), 'No searches yet.', openPlace);
}
$('#clear-history').addEventListener('click', () => {
  store.clearHistory();
  showLists();
});



//cities suggestions
const loadSuggestions = debounce(async (text) => {
  if (loading) return;
  try {
    const places = await suggest(text);
    ui.renderSuggestions(places, (place) => {
      input.value = placeLabel(place);
      run(() => place);
    });
  } catch {
    ui.hideSuggestions(); // suggestions are optional, so just ignore any errors
  }
});

input.addEventListener('input', () => {
  const text = input.value.trim();
  if (text.length < 3 || !store.getApiKey()) {
    ui.hideSuggestions();
    return;
  }
  loadSuggestions(text);
});

//to close suggestions when user click anywhere else
document.addEventListener('click', (event) => {
  if (!event.target.closest('.search-area')) ui.hideSuggestions();
});



initMap('map');
showLists();
ui.initKeyDialog();