import React, { Component } from 'react';
import LLayers from './Layers'
import {
  Map,
  TileLayer,
} from 'react-leaflet'
import '../css/leaflet.css';


const center = [25.64837124674059, -80.712685]

const DEFAULT_VIEWPORT = {
  center: center,
  zoom: 10,
  LayersControl: true,
  attributionControl: true,
  closePopupOnClick: true,
  doubleClickZoom: true,
  dragging: true,
  fadeAnimation: true,
  maxZoom: 18,
  minZoom: 0,
  scrollWheelZoom: true,
  touchZoom: true,
  trackResize: true,
  zoomAnimation: true,
  zoomControl: false,
};


class LMap extends Component {

  state = {
    viewport: DEFAULT_VIEWPORT,
  };

  onClickReset = () => {
    this.setState({ viewport: DEFAULT_VIEWPORT })
  };
  onViewportChanged = viewport => {
    this.setState({ viewport })
  };
  render() {
    return (
      <div className="ch-map">
        <Map
          onClick={this.onClickReset}
          onViewportChanged={this.onViewportChanged}
          viewport={this.state.viewport}>
          <TileLayer
            url="https://{s}.tiles.mapbox.com/v3/inhabitmiami.l269hdof/{z}/{x}/{y}.png"
          />
          <LLayers />
        </Map>
      </div>
    )
  }
}

export default LMap;
