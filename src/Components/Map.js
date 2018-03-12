import React from 'react';
import L from 'leaflet';
import Layers from './Layers.js';
import mapPopup from "./Elements/mapPopup.js";

const center = [26.1224, -80.1373];
const StateBounds = new L.LatLngBounds(
  new L.LatLng(26.2142, -80.0570),
  new L.LatLng(26.0743, -80.2333)
);

class LMap extends React.Component {

  constructor(props) {
    super(props);

    this.map = this.map.bind(this);

    this.state = {
      map: '',
      baseLayers: {},
      mapData: {},
      layerExist: true,
    };
  }

  componentDidMount() {
    this.map();
  }

  map() {
    const map = L.map('map').setView(center, 10);

    this.setState({
      map: map
    });

    map.setMaxBounds(StateBounds);
    map.options.minZoom = map.getBoundsZoom(StateBounds);

    let mapData = {},
    layerExist  = false;

    map.on('click', function(e) {
      function propertyLayer(map, data) {
        if (data.data.items[0]) {
          const shape = {
            'type': 'FeatureCollection',
            'features': [{
              'type': 'Feature',
              'geometry': {
                'type': data.data.items[0].gisData.geom.type ? data.data.items[0].gisData.geom.type : 'Poligon',
                'coordinates': data.data.items[0].gisData.geom.coordinates ? data.data.items[0].gisData.geom.coordinates : ''
              }
            }]
          };

         const newLeayer =  L.geoJson(shape, {type:'property-layer', key:'property-layer-' + data.data.items[0].id});


          map.eachLayer(function (layer) {
            if ('options' in layer && 'options' in newLeayer &&  layer.options.type ===  'property-layer') {
              if (layer.options.key !== newLeayer.options.key) {
                  map.removeLayer(layer);
              }
              else {
                layerExist = true;
              }
            }
          });
          if (!layerExist) {
            console.log(data);
            mapData['title'] = data.address;
            mapData['body'] = <div>Propety info</div>;
            mapData['footer'] = <button>Sign Up</button>;
            newLeayer.addTo(map);
          }
        }
      }

      fetch('https://fl-api.gridics.com/api/property_record?token=zcJ6xtQbyiMQNfskLFmiPEDFocl1hheP&geometryFormat=geojson&rows=50&offset=0&ignoreStatus=&indent=&point_search={"geometry":"POINT (' + e.latlng.lng + ' ' + e.latlng.lat + ')"}')
        .then(results => results.json())
        .then(data => propertyLayer(this, {data}))
    });
    this.setState({mapData:mapData, layerExist:layerExist});
  }

  render() {
    return (
      <div className="wrapper">
        {(this.state.map) ? <Layers map={this.state.map} showLayers={this.props.showLayers} /> : ''}
        {(!this.state.layerExist) ? <mapPopup mapData={this.state.mapData} /> : ''}
        <div id="map" className="ch-map"></div>
      </div>
    );
  }
}


export default LMap;
