/**
 * 
 */

let map;
let marker;

// creating the map
export function initMap(id) {
  map = L.map(id).setView([15.5007, 32.5599], 6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map);
}


//movess the map, show one marker and open its popup
export function showPlace(place, popupContent) {
  if (marker) map.removeLayer(marker); // remove the old marker
  marker = L.marker([place.lat, place.lon]).addTo(map);
  marker.bindPopup(popupContent, { autoPan: false, minWidth: 220 });
  map.flyTo([place.lat, place.lon], 10); // smooth animation
  marker.openPopup();
}
