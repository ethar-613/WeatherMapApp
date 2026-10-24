/**
 * little helper functions used for all app in multiple files [share.js , ui.js and app.js for now] 
 * to pervent the dublications of code 
 * and they know nothing about the map or networl, only used for transformation and text.
 * uses export in all of them becz es modules isolate each file, making dependencies betwwn files clear
*/


// this arow function is a shortcut for document.querySelector to get the element by its id or class 
// pass for it parameter "selector" is css selector like .btn or #city
// returns the first element in the page that match the selector or return "null" if no match found
export const $ = (selector) => document.querySelector(selector);


// this arow function convert the first letter of the text to be uppercase/capital letter and leave the other letters normal
// used on OpenWeatherMap to display the descibes on the card like "Broken clouds". its just for more formal look
// pass for it parameteer "text" that is a normal text
// return the same text with first capital letter 
export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);


// this arrow func uses to display the official OpenWeatherMap icon in popup window and forecasts.
// pass it parameter "code" is text, its thet icon code from the API suchas "10d"
// returns a link to the offecial icon image with @2x  resolution
export const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;


// this func uses to display the location name consistently in favorites, history, sharing and popup window and share weather
// pass it parameter "place" that is an object representing a location with 'name' and 'country'
// returns a string that have the country and the city names suchas "London, GB"
export const placeLabel = (place) => `${place.name}, ${place.country}`;


// use for automatic city suggestions. waits until the user stop typing after delay time before running a function
// without it a network request is sent with every character written consuming teh limit for minutes/requests. 
// so it used to reduce network requests and improve performance.  uses it in app.js with input event.
// pass it parameters "fn" is the function that execution is to be delayed. 
//                    "delay" is the delay time in milliseconds and its default is 400
// returns a new function that wrap "fn" function.
export function debounce(fn, delay = 400) {
  let timer; 
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}


// turn the forecast list into one summary per day. converting 40 readings into a daily summary to display it on forecast cards. 
// pass it parameter "list" is an array of forecasts from /forecasts , each element in it represent 3-hour period. 
//                        each element contains dt_txt that is the time and date, and main.temp and weather[0].
// returns and array of 5 objects, each object like {date, min, max , icon, desc}
export function groupDaily(list) {
  const days = {}; // empty object, its keys will be dates.
  list.forEach((item) => {
    const date = item.dt_txt.slice(0, 10); //slice first 10 chars, its the date
    if (!days[date]) days[date] = []; //check if no array for this date then create one for it
    days[date].push(item); //push the item to days object
  });

  // here return a list of dates and select only the first 5 days and convert each date into a summary
  return Object.keys(days).slice(0, 5).map((date) => {
    const items = days[date];
    const temps = items.map((item) => item.main.temp); //array conatin only the temperatures
    const middle = items[Math.floor(items.length / 2)]; //to use its icon for the day
    return {
      date,
      min: Math.min(...temps),
      max: Math.max(...temps),
      icon: middle.weather[0].icon,
      desc: middle.weather[0].description,
    };
  });
}


// turn the date to for example: "Monday, Oct 12" to display it like this in the card
// pass to it "date" is a date string like "12-10-2026" 
// return string of the date like "Monday, Oct 12". the full name of the day of the week, abbreviated month, and the day number of the month
export function dayLabel(date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' });
}
