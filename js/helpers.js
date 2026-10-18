// little helper functions used for all app

// this is a shortcut for document.querySelector
export const $ = (selector) => document.querySelector(selector);

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
export const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;
export const placeLabel = (place) => `${place.name}, ${place.country}`;

// to use for city suggestions
//waits until the user stop types before running a function
export function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };}


  // turn the forecast list into one summary per day
export function groupDaily(list) {
  const days = {};
  list.forEach((item) => {
    const date = item.dt_txt.slice(0, 10); 
    if (!days[date]) days[date] = [];
    days[date].push(item);
  });

  return Object.keys(days).slice(0, 5).map((date) => {
    const items = days[date];
    const temps = items.map((item) => item.main.temp);
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

// turn the date to for example: "Mon, Oct 12" to display it like this in the card
export function dayLabel(date) {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' });
}
