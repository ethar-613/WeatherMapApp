/**
 * this is storage layer, everything stored on browser passes through here, 
 * and other files dont directly access the localstorage or sessionstorage
 * store here for now 3 things: api key in sessionstorage it remain until the tap is closed.
 * and favorites cities and search history cities both in localstorage and it will be always saved 
 * imported by api.js to read the api key, ui.js for api key dialog, and app.js for favorites and search history 
*/


// _________________________________________________________________________________________
// _________________________________________________________________________________________
// API KEY SETUP
// this section is to handle the store of the api key
// api key to store it in session Storage only, 
// sessionStorage be cleared when the tab closed, thats why its suitable for the key cuz it do not remain on the device.

// this function is to get the stored api key, if no key stored then return null
// api.js use this function before every request to add the appid
// need no parameters,
// returns the saved key as string or '' if no key stored.
export function getApiKey() {
  try {
    return sessionStorage.getItem('wm_api_key') || '';
  } catch {
    return '';
  }
}

// this function is to save the key that the user add under the name 'wm_api_key' when the user click the "save key" button
// its parameter is "key" is a string, its the key enetered by user
// return true if storing the key success or false if it fails
export function saveApiKey(key) {
  try {
    sessionStorage.setItem('wm_api_key', key);
    return true;
  } catch (error) {
    console.warn('Session storage is not available:', error);
    return false;
  }
}

// this function removes the stored key when the user click on "remove key" button
// need no parameters, and return nothing.
export function clearApiKey() {
  try {
    sessionStorage.removeItem('wm_api_key');
  } catch {
    /* no thing to clear */
  }
}


// _________________________________________________________________________________________
// _________________________________________________________________________________________
// local storage presists even after the browser closed, thats why its suitable for favorites and history


// this function for reading saved value, or return a default if nothing saved 
// this function not exported cuz it will only be used in the file. 
// getItem(key) return string or null value. if it null it will return the default value
// if the string stored is corrupted then throws an error catched by catch and return the default value
// parameters; "key" is the key name that assign to the value in the localstorage that wanted to read, 
//              "defaultValue" is the value that returns if nothing saved for this key.
// returns the stored value after convert it from json to array/object or return the defaultValue
function load(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch {
    return defaultValue;
  }
}

// this function used to save value and key name to get theh value using it. 
// it convert the "value" into string in json formula and save ithem by setItem().
// if the storage full or somthing went wrong it will catch an error
// parameters; "key" is the key name. 
// "value" is any value can be array or object will be stored in local storage with key name. and can return it using the key name.
// this function return nothing
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.log('Could not save data in this browser.');
  }
}

// to know if two places are the same city if they have the same coordinates
// parameters; "a" and "b" is lat and lon
// returns 'True' if the coordinates match exactly, if not then return 'False'
const sameCity = (a, b) => a.lat === b.lat && a.lon === b.lon;


// _________________________________________________________________________________________
// _________________________________________________________________________________________
// Favorites section

// this arrow function used to return the favorites cities array from the local setorage, if no cities then return empty array. no parameters need
export const getFavorites = () => load('wm_favorites', []);

// this function check if the place/city passed to it is match any of the cities stored in favorites array or no match
// used for the appearance of the favorite star is specified in the popup window(filled or no)
// parameter "place" is a place object that wandt to check if its in fav or not
// returns "True" if some() found any match or "False" if no match found
export const isFavorite = (place) => getFavorites().some((fav) => sameCity(fav, place)); 

// this function adds the city if its not saved before, remove it if its in.
// it reads the current favorites first, 
// if the city exists in the favorites array then it will save new array without this city and return false.
// it used for single button that adds and removes items. 
// and the returns value allowed in app.js to change the button diplay and the confirmation message
// if the city not exists it adds it using push(), then save it in the storage and return true
// parameter "place" ia a place object
// return True if the place became favorite now , return false if the place removed
export function toggleFavorite(place) {
  const favorites = getFavorites();
  if (isFavorite(place)) {
    save('wm_favorites', favorites.filter((fav) => !sameCity(fav, place))); //filter() to save the array without this city
    return false;
  }
  favorites.push(place);
  save('wm_favorites', favorites);
  return true;
}


// _________________________________________________________________________________________
// _________________________________________________________________________________________
//Search history, storing only last 10 cities

// this arrow function used to return the search history array from the local setorage, if no cities then return empty array. no parameters need
export const getHistory = () => load('wm_history', []);

// this function called after every successful search 
// its read the search history from the storage and removes any previous entries for the same city to pervent duplicates
// then add the location to the beginning, to show the mose recent one first 
// then keeeps only the first 10 places, and discard the oldest ones and then save the result on the storage
// parameter "place" is a place object. and its return nothing/undefiend
export function addHistory(place) {
  const history = getHistory().filter((item) => !sameCity(item, place)); // ensures no duplicates
  history.unshift(place); // to show newest first
  save('wm_history', history.slice(0, 10));
}

// this arrow function used when user click on "clear history" button
// its save empty array on for the history and like this it cleared for the user. it return nothing and need no parameters.
export const clearHistory = () => save('wm_history', []);
