/**
 * this file is the controller and the entry point loaded by index.html, 
 * it do not render anything on its own and not do it connect to the network directly,
 * rather than that it loads the rest of the files in the correct order and bind page events to them
 */

import { initMap, showPlace  } from './map.js';
import * as ui from './ui.js'; 
import { $, placeLabel, debounce, groupDaily } from './helpers.js';
import * as store from './storage.js';
import { geocode, getWeather , suggest, getForecast  } from './api.js';
import { shareOnFacebook, copyWeatherText } from './share.js';
// ____________________________________________________________________________________________

const form = $('#search-form');
const input = $('#city');
let loading = false;

// ____________________________________________________________________________________________
// this function is the main flow of the application, it gets a place, 
// fetchs its current weather and forecasts then shows them on the map an in the page
// parameters "getPlace" is a function that returns a alocation or promise containing it. its a function not value cuz the source of the location varies
// returns a promise with no value(undefiened) cuz its asynchronous
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
    const weather = await getWeather(place.lat, place.lon);    // get current weather for this place
    const forecast = await getForecast(place.lat, place.lon); // get five day forecast data for this place
    const days = groupDaily(forecast.list); 

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
    ui.renderForecast(place, days);
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

// ____________________________________________________________________________________________
// ____________________________________________________________________________________________
// this is a form submission event
// this happens when clicked on "get weather" button or pres enter
// parameter "event" is the event object
form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading
  const text = input.value.trim(); //reads the text and remove extra spaces
  if (text === '') { //if empty show error message and no request
    ui.showError('Please type a city name first.'); 
    return;
  }
  ui.hideSuggestions();
  run(() => geocode(text)); //starting the search
});


// ____________________________________________________________________________________________
// ____________________________________________________________________________________________
//Favorites 

// this passed as "onSelect" to thet favorites and history buttons. clicking on the button displaying the weather immediatly without geocoding
// parameter place is location that ready to use
// returns promise from run()
const openPlace = (place) => run(() => place);

// this function redraw the two lists from the storage
// need no parameters and no return value
function showLists() {
  ui.renderChips($('#favorites'), store.getFavorites(), 'No favorites yet.', openPlace, (place) => {
    store.toggleFavorite(place); // to remove or adding from favorites
    showLists(); //display the new list after toggle
  }); //redraw the favorite list
  ui.renderChips($('#history'), store.getHistory(), 'No searches yet.', openPlace); //redraw the search history list, without 'onRemove' so x button not appear
}

// this event happen when user clicked on clear history button to cleare the search history list and redraw the list(empty list)
$('#clear-history').addEventListener('click', () => {
  store.clearHistory();
  showLists();
});


// ____________________________________________________________________________________________
// ____________________________________________________________________________________________
//cities suggestions

// this a function returned by 'debounce(async fn)' that wait 400ms after the last char entered 
// suggestions is optional feature so i dont want to bother the user with an error message about it
// parameters; "text" is the text entered by the user
// returns nothing
const loadSuggestions = debounce(async (text) => {
  if (loading) return; //so do not display suggestions while the search on progress
  try {
    const places = await suggest(text);
    ui.renderSuggestions(places, (place) => {
      input.value = placeLabel(place);
      run(() => place);
    });
  } catch {
    ui.hideSuggestions(); // suggestions are optional, so just ignore any errors and just hide it
  }
});

// this input event ocuurs on the input field,
//  no suggestions if the text less than 3 chars, or if there no key. this to save the requests and enfoced the 60/min limit
input.addEventListener('input', () => {
  const text = input.value.trim();
  if (text.length < 3 || !store.getApiKey()) {
    ui.hideSuggestions();
    return;
  }
  loadSuggestions(text);
});

//event to close suggestions when user click anywhere else not inside the suggestions area 
document.addEventListener('click', (event) => {
  if (!event.target.closest('.search-area')) ui.hideSuggestions(); //uses "closest" to searchex on the element and its ancestors for the selector
});

// ____________________________________________________________________________________________
// ____________________________________________________________________________________________

initMap('map'); //creating the base map
showLists(); //display the favorites and search history stored lists 
ui.initKeyDialog(); //for dialog window events and to show the state of the key



