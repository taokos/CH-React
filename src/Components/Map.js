import React, { Component } from 'react';
import '../css/leaflet.css';
import L from 'leaflet'
import {GroupedLayers} from 'leaflet-groupedlayercontrol'
import groupedOverlays from './Layers.js';


const center = [25.64837124674059, -80.712685];

class LMap extends React.Component {
  componentDidMount() {
    this.map();
  }
  
  map() {
    var map = L.map('map').setView(center, 10);

    const streeAttr = '&amp;copy <a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> contributors',
      streeUrl = 'https://{s}.tiles.mapbox.com/v3/inhabitmiami.l269hdof/{z}/{x}/{y}.png',
      satelliteAttr = '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a> <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>',
      satelliteUrl = 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaW5oYWJpdG1pYW1pIiwiYSI6IlVqbDFmYW8ifQ._WCxjKTHYFmq6bdIUeLwYA';
  
    const street   = L.tileLayer(streeUrl, {attribution: streeAttr, checked: true}),
      satellite  = L.tileLayer(satelliteUrl, {attribution: satelliteAttr});
  

    const baseLayers = {
      "Streets": street,
      "Satellite": satellite
    };
    
    L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);
    
    L.tileLayer(streeUrl, {
      attribution: streeAttr
    }).addTo(map);
  }
  
  render() {
    return <div id="map" className="ch-map">xx</div>
  }
}

export default LMap;
