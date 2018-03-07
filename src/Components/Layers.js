import React, { Component } from 'react';
import {
  Circle,
  CircleMarker,
  Map,
  Marker,
  Polygon,
  Polyline,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  Popup,
  Rectangle,
  GeoJSON,
  TileLayer,
} from 'react-leaflet'
import api_layers from '../data.json';

const API = 'https://st1-api.gridics.com/api/_map_tile_layers?token=zmk6RrsXXbrw0o8j0fqA3g6LuKP207I1';
const LAPI = 'https://local-codehub.gridics.com/api/v1/codehub_layers/6?_format=json';
const MapShape = 'https://fl-api.gridics.com/fast-ajax/map_shape?map=';

const { BaseLayer, Overlay } = LayersControl;

class LLayers extends Component {
  constructor(props) {
    super(props);
  
    this.createGeoJsonObject = this.createGeoJsonObject.bind(this);
  //  this.appSetShape = this.appSetShape.bind(this);

    this.state = {
      layers: [],
      api_layers: [],
      shape: {},
    };
  }
  
  componentDidMount() {
    fetch(API)
      .then(results => results.json())
      .then(data => this.setState({layers: data}));
    // fetch(LAPI)
    //   .then(lresults => lresults.json())
    //   .then(ldata => this.setState({ api_layers: ldata}))
    Object.keys(api_layers).map(group => {
      return (
        api_layers[group].layers.map((layer, i) => {
          const apiUrl = MapShape + api_layers[group].layer_type + '&' + api_layers[group].layer_type + '=' + layer.layer_id;
          fetch(apiUrl)
            .then(results => results.json())
            .then(data => this.createGeoJsonObject(data, i));
        })
      )
    });
  }
  
  createGeoJsonObject(data, i) {
    const shape = this.state.shape;
    if (data.overlay[0]) {
        shape[i] = {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': data.overlay[0] ? data.overlay[0].type : '',
            'coordinates': data.overlay[0] ? data.overlay[0].coordinates : ''
          }
        }]
      };
      this.setState({
        shape: shape
      })
    }
  }
  
  onEachFeature = (feature, layer) => {
    layer.on({
      click: this.clickToFeature.bind(this)
    });
  };
  
  clickToFeature = (e) => {
    const layer = e.target;
  };
  
 
  render() {
    const { layers } = this.state;
    const { shape } = this.state;
    return (
      <LayersControl position="topleft">
        <BaseLayer checked name="Streets">
          <TileLayer
            attribution="&amp;copy <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tiles.mapbox.com/v3/inhabitmiami.l269hdof/{z}/{x}/{y}.png"
          />
        </BaseLayer>
        <BaseLayer name="Satellite">
          <TileLayer
            attribution='<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a> <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>'
            url="https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaW5oYWJpdG1pYW1pIiwiYSI6IlVqbDFmYW8ifQ._WCxjKTHYFmq6bdIUeLwYA"
          />
        </BaseLayer>
         {Object.keys(layers).map(layer =>
          <Overlay key={layer} name={layers[layer].title}>
            <TileLayer
              attribution={layers[layer].options.attribution}
              url={'https:' + layers[layer].options.urlTemplate}
            />
          </Overlay>
        )}
        {Object.keys(api_layers).map(group => {
          return (
            api_layers[group].layers.map((layer, i) => {
              console.log(this.constMult);
              if (typeof shape[i] !== 'undefined') {
                console.log(shape)
                return (
                  <Overlay key={i} name={layer.layer_title}>
                    <FeatureGroup color="purple">
                      <Popup>
                        <span>Layer Title layer.layer_title</span>
                      </Popup>
                      <GeoJSON
                        key={i}
                        data={shape[i]} />
                    </FeatureGroup>
                  </Overlay>
                )
              }
            })
          )}
        )}
      </LayersControl>
    )
  }
}

export default LLayers;
