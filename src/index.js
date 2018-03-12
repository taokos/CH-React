import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './Components/App';
import './css/leaflet.css';
import L from 'leaflet'

import registerServiceWorker from './registerServiceWorker';


// const position = [25.64837124674059, -80.712685];
// const map = L.map('map').setView(position, 13);
//
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map);
//
// L.marker(position)
//   .addTo(map)
//   .bindPopup('A pretty CSS3 popup. <br> Easily customizable.');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
