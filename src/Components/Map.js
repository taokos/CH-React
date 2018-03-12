import React from 'react';
import '../css/leaflet.css';
import L from 'leaflet';
import groupedOverlays from './Layers.js';

const center = [25.64837124674059, -80.712685];
const StateBounds = new L.LatLngBounds(
  new L.LatLng(32.120, -92.164),
  new L.LatLng(23.211, -75.454)
);

class LMap extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.map = this.map.bind(this);

    this.state = {
      map: {},
      baseLayers: {},
    };
  }
  
  componentDidMount() {
    this.map();
  }
  
  map() {
    const map = L.map('map').setView(center, 10),
      streeAttr = '&amp;copy <a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> contributors',
      streeUrl = 'https://{s}.tiles.mapbox.com/v3/inhabitmiami.l269hdof/{z}/{x}/{y}.png',
      satelliteAttr = '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a> <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>',
      satelliteUrl = 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaW5oYWJpdG1pYW1pIiwiYSI6IlVqbDFmYW8ifQ._WCxjKTHYFmq6bdIUeLwYA',
      street   = L.tileLayer(streeUrl, {attribution: streeAttr}),
      satellite  = L.tileLayer(satelliteUrl, {attribution: satelliteAttr}),
      baseLayers = {
        "Streets": street,
        "Satellite": satellite
      };

    map.setMaxBounds(StateBounds);
    map.options.minZoom = map.getBoundsZoom(StateBounds);
    
    L.control.groupedLayers(baseLayers, groupedOverlays, {position:"topleft"}).addTo(map);
  
    this.setState({
      map: map,
      baseLayers: baseLayers
    });

    L.tileLayer(streeUrl, {
      attribution: streeAttr
    }).addTo(map);
  }
  
  render() {
    return <div id="map" className="ch-map">xx</div>
  }
}

export default LMap;
