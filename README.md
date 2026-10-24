# WeatherMap Project

~ web advanced project 2
~ ايثار عماد الدين احمد - تقانة معلومات

## Description:

WeatherMap is single page application (SPA) built for Advanced Web Technologies course.
The user types a city, the app finds its coordinates, moves an interactive map to that place, and shows the current weather inside a popup card on the map, together with a five-day forecast.
Everything runs in the browser with asynchronous requests (Fetch API, Promises, async/await), so the page never reloads or redraws.

- **Live demo:**  ```https://ethar-613.github.io/WeatherMapApp/```
- **Repository:**  ```https://github.com/ethar-613/WeatherMapApp.git```

## Features:
   - interactive map (Leaflet+OpenStreetMap), starts on khartoum, sudan with zoom 6
   - city search with smooth flyTo animation and a single marker, old marker be removed on every search
   - weather popup bound to the marker: city name, temperature, weather description, clouds, humidity, wind speed, feels like, and official OpenWeatherMap icon
   - five-day forecast cards (min / max temperature and icon foreveryday)
   - automatic city suggestions while typing (delayed with debounce to save API calls)
   - share on Facebook button and "Copy weather text" button inside the popup
   - favorite cities, saved in localStorage, shown as quick-access buttons
   - search history (last 10 searches), with a "clear history" button
   - loading spinner while network requests are running
   - user-friendly alert cards for errors (city not found, invalid key, no internet, too many requests, API errors)
   - "API key setup" popup, so each visitor uses their own key
   - responsive layout for mobile and desktop

## Technologies:
   - html5 (semantic elements, <dialog>, ARIA attributes)
   - javaScript (modules, Fetch API, async/await) - vanilla only
   - css 3 (custom properties, flexbox, grid, animations, media queries)
   - Leaflet.js with OpenStreetMap tiles
   - google fonts
   


## API Used:
   - openWeatherMap Geocoding (/geo/1.0/direct) --> used to convert a city name to latitude and longitude, and give city suggestions --> needed key
   - openWeatherMap Current Weather (/data/2.5/weather) -->	used to get current temperature, humidity, wind, clouds and status --> needed key
   - openWeatherMap 5 day Forecast (/data/2.5/forecast) --> used to get data for the five-day forecast cards --> needed key
   - openStreetMap tiles (useing Leaflet) --> used for map images --> no need for key 

   - so one free OpenWeatherMap key is enough for the three OpenWeatherMap service

## Getting an API key:
   1. create a free account at openweathermap.org
   2. open My API keys in your profile and copy your key
   3. new key can take hours to become active. until then the app shows an "invalid key" message

## How to use the key in the app:
- open the app and click API key setup
- paste your key and click Save key
- tthe key is stored only in sessionStorage of your browser, so it disappears when the tab is closed, and it is not written in any project file and never uploaded to github
- note: this is pure front-end project, so any key used by the browser can be seen in the Network tab of the developer tools. For this reason every visitor enters their own free key instead of the project owner publishing one

## How to run( on XAMPP ):
- install and start XAMPP. 
- start apache on XAMPP
- copy the project folder into C:\xampp\htdocs\  (keep the same folder name used in the link on next step)
- open the browser at:
         ```http://localhost/wheatherMapAPP/```

- click API key setup button and enter your OpenWeatherMap key
- the app use JavaScript modules, so it must be opened through a server (XAMPP, GitHub Pages, or any local server). Opening index.html by double-click will not work.

## How to run ( on GitHub Pages ):
1. open this link to open this project in the github page 
                     '''https://ethar-613.github.io/WeatherMapApp/'''
2. click API key setup button and enter your OpenWeatherMap key

## Data sources:
Weather data by OpenWeatherMap - Map data by OpenStreetMap contributors - Map library: Leaflet