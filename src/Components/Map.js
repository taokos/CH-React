import React from 'react';
import L from 'leaflet';
import Layers from './Layers.js';
import BaseLayer from './Elements/BaseLayer.js';
import Control from 'react-leaflet-control';
import { render, unmountComponentAtNode } from 'react-dom';

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
      map: '',
    };
  }

  componentDidMount() {
    this.map();
  }

  map() {
    const map = L.map('map').setView(center, 10);
    map.setMaxBounds(StateBounds);
    map.options.minZoom = map.getBoundsZoom(StateBounds);
    map.zoomControl.setPosition('bottomright');
    this.setState({
      map: map
    });
  }

  render() {
    var baseLayer = '',
        layers = '';
    if (this.state.map) {
      layers = <Layers
          toggleLayers={this.props.toggleLayers}
          map={this.state.map}
          showLayers={this.props.showLayers} />;
      baseLayer = <BaseLayer map={this.state.map} />;
    }
    return (
      <div className="map-wrapper">
        {layers}
        {baseLayer}
        <div id="map" className="ch-map"></div>
      </div>
    );
  }
}


export default LMap;
