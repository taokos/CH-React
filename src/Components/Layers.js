import React, {Children, cloneElement, Component} from 'react';
import L from 'leaflet';

// Temporary solution for the ST1.
import api_layers from '../data.json';

const API = 'https://st1-api.gridics.com/api/_map_tile_layers?token=zmk6RrsXXbrw0o8j0fqA3g6LuKP207I1';
const LAPI = 'https://st1-codehub.gridics.com/api/v1/codehub_layers/6?_format=json';
const MapShape = 'https://fl-api.gridics.com/fast-ajax/map_shape?map=';


// class LLayers extends Component {
//   constructor(props) {
//     super(props);
//     this.createGeoJsonObject = this.createGeoJsonObject.bind(this);
//     // this.fLayers = this.fLayers.bind(this);
//     this.state = {
      const layers = [];
      // api_layers = [],
      let shape = {};
//     };
//   }

    fetch(API)
      .then(results => results.json())
      .then(data => setTo(data, layers));
    // fetch(LAPI)
    //   .then(lresults => lresults.json())
    //   .then(ldata => layers[ldata]);
    Object.keys(api_layers).map(group => {
      return (
        api_layers[group].layers.map((layer, i) => {
          const apiUrl = MapShape + api_layers[group].layer_type + '&overlay=1&' + api_layers[group].layer_type + '=' + layer.layer_id;
          fetch(apiUrl)
            .then(results => results.json())
            .then(data => createGeoJsonObject(data, i));
        })
      )
    });

    // {Object.keys(layers).map((layer, i ) =>
    //   layers[layer].title
    //       attribution={layers[layer].options.attribution}
    //       url={'https:' + layers[layer].options.urlTemplate}
    // )}


  function createGeoJsonObject(data, i) {
    const tShape = shape;
    if (data.overlay[0]) {
      tShape[i] = {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': data.overlay[0] ? data.overlay[0].type : '',
            'coordinates': data.overlay[0] ? data.overlay[0].coordinates : ''
          }
        }]
      };
      shape = tShape;
    }
  }

  console.log(shape, api_layers, layers);

  const cities = new L.LayerGroup();
  
  const restaurants = new L.LayerGroup();
  
  // Overlay layers are grouped
  const groupedOverlays = {
    "Landmarks": {
      "Cities": cities
    },
    "Points of Interest": {
      "Restaurants": restaurants
    }
  };
  

export default groupedOverlays;
