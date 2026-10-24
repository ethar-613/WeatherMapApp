/**
 * this file is about sharing the weather, open Facebook window and copy weather info to clipboard
*/

import { placeLabel } from './helpers.js';//to format the place name as"cityName, countryName" on the weather message
// _________________________________________________________________________________________
// _________________________________________________________________________________________
//this function provide a message that contain the place waether information 
// no export for it cuz used it on this file only
// used as single source for the message text so share and copy have it without duplicate it
// parameters; "place" is object have the place info[name,country,lat,lon], "weather" object have the weather info for this place
// return string, the message that have the place and weather info 
function weatherText(place, weather) {
  return `Weather in ${placeLabel(place)}: ${Math.round(weather.main.temp)}°C, ${weather.weather[0].description}.` +
    ` Humidity ${weather.main.humidity}%, wind ${weather.wind.speed} m/s. , it Feels Like ${weather.main.feels_like}°C`;
}

// _________________________________________________________________________________________
// this to open the Facebook share window and give the weather info text
// parameters; "place" is object have the place info[name,country,lat,lon], "weather" object have the weather info for this place
// return nothing
export function shareOnFacebook(place, weather) {
  const pageUrl = window.location.origin + window.location.pathname; //the url for current page without parameters
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(weatherText(place, weather))}`;
  window.open(url, '_blank', 'width=600,height=500'); //open new window
}

// _________________________________________________________________________________________
// copy the message to the clipboard. the returned value used in app.js tto display a success or failure message 
// cliboard interface work only in secure context: https or localhost
// parameters; "place" is object have the place info[name,country,lat,lon], "weather" object have the weather info for this place
// return promise that resolved if the copy sucess and turn "True" , or "False" if rejected
export async function copyWeatherText(place, weather) {
  try {
    await navigator.clipboard.writeText(weatherText(place, weather)); //to copy the text(the parameter) to the operating system's cliboard
    return true;
  } catch {
    return false;
  }
}
