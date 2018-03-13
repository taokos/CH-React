import React, { Component } from 'react';
import L from 'leaflet';
import { render, unmountComponentAtNode } from 'react-dom';

L.Control.BaseControl = L.Control.extend({
  options: {
    className: '',
    onOff: '',
    handleOff: function noop(){}
  },

  onAdd: function (map) {
    var _controlDiv = L.DomUtil.create('div', this.options.className);
    L.DomEvent.disableClickPropagation(_controlDiv);
    return _controlDiv;
  },

  onRemove: function (map) {
    if (this.options.onOff) {
      map.off(this.options.onOff, this.options.handleOff, this);
    }

    return this;
  }
});

export default class BaseLayer extends Component {
  baseLayers = {
    'streets': {
      'name': 'Street View',
      'url': 'https://{s}.tiles.mapbox.com/v3/inhabitmiami.l269hdof/{z}/{x}/{y}.png',
      'options': {
        'attribution': '©<a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a> contributors',
        'zIndex': -99
      }
    },
    'satelite': {
      'name': 'Satelite',
      'url': 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaW5oYWJpdG1pYW1pIiwiYSI6IlVqbDFmYW8ifQ._WCxjKTHYFmq6bdIUeLwYA',
      'options': {
        'attribution': '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a> <a href="https://www.digitalglobe.com/" target="_blank">© DigitalGlobe</a>',
        'zIndex': -99
      }
    }
  };

  componentWillMount() {
    this.leafletElement = new L.Control.BaseControl({position: 'bottomright'});
    this.leafletElement.addTo(this.props.map);
  }


  componentDidMount(){
    this.renderContent();
  }

  componentDidUpdate() {
    this.renderContent();
  }

  constructor(props) {
    super(props);
    const defaultLayer = new L.TileLayer(this.baseLayers['streets'].url, this.baseLayers['streets'].options);
    this.state = {
      checked: 'streets',
      baseLayer: defaultLayer.addTo(props.map)
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const checked = (this.state.checked === 'streets') ? 'satelite' : 'streets';
    const defaultLayer = new L.TileLayer(this.baseLayers[checked].url, this.baseLayers[checked].options)
    this.state.baseLayer.remove();
    this.setState({
      checked: checked,
      baseLayer: defaultLayer.addTo(this.props.map)
    });
  }

  renderContent() {
    const _this = this;
    const container = this.leafletElement.getContainer();
    render(
      <a href="#" className={"base-layer-switcher " + this.state.checked} onClick={_this.handleChange}></a>,
      container
    );
  }

  render() {
    return null;
  }
}
