import React, { Component } from 'react';
import { render } from 'react-dom'
import L from 'leaflet'
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
  TileLayer,
} from 'react-leaflet'
import './css/leaflet.css';


const center = [25.64837124674059, -80.712685]
const { BaseLayer, Overlay } = LayersControl

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
      <Map
        onClick={this.onClickReset}
        onViewportChanged={this.onViewportChanged}
        viewport={this.state.viewport}>
        <TileLayer
          url="https://{s}.tiles.mapbox.com/v3/inhabitmiami.l269hdof/{z}/{x}/{y}.png"
        />
        <LayersControl position="topright">
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
        </LayersControl>
      </Map>
    )
  }
}

export default LMap;
