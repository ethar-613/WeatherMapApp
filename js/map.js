/**
 * this file reponsible for the map only
 * it generate the map, place marker, and open popups window
 */

// no export for this variables so no other file can modify it 
let map; //hold the map object after it created 
let marker; //hold the current marker so can delete it when searching for new location

// this function used to creating the base map when the page load using Leaflet and openStreetMap 
// parameter "id" is the id of the <div> element on html where the map be placed, will use the id "map" for it 
// returns nothing 
export function initMap(id) {
  map = L.map(id).setView([15.5007, 32.5599], 6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution:'© Map data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
  }).addTo(map);
}


// this function used to movess the map to the place location, and display its marker and open its popup. also remove the previous marker
// parameters; "place" is object contain the lat & lon for the place and other location data
// "popupContent"  have the content of the popup window 
// return nothing
export function showPlace(place, popupContent) {
  if (marker) map.removeLayer(marker); // remove the old marker
  marker = L.marker([place.lat, place.lon]).addTo(map);//adding marker to the place in the map and save it on "marker" 
  marker.bindPopup(popupContent, { autoPan: false, minWidth: 220 });//binding the popup with the marker and dont move the map
  map.flyTo([place.lat, place.lon], 10); // smooth animation
  marker.openPopup(); //open the popup immediatly
}
