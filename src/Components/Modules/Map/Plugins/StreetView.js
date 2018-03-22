import React from 'react';
import ReactDOM from 'react-dom';
import asyncLoading from 'react-async-loader';

class StreetView extends React.Component {
  constructor() {
    super();
    this.streetView = null;
  }

  initialize (canvas) {
    if (this.props.googleMaps && this.streetView == null) {
      const geocoder = new this.props.googleMaps.Geocoder(), thet = this;
      let lat = null , lng = null;
      // Found point by Address if posible.
      geocoder.geocode( { 'address': this.props.address}, function(results, status) {
        if (results[0] && 'geometry' in results[0] && 'location' in results[0].geometry) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            thet.props.streetViewPanoramaOptions.position = {lat: lat, lng: lng};
        }
        thet.streetView = new thet.props.googleMaps.StreetViewPanorama(
          canvas,
          thet.props.streetViewPanoramaOptions
        );
        thet.streetView.addListener('position_changed',() => {
          if (thet.props.onPositionChanged) {
              thet.props.onPositionChanged(thet.streetView.getPosition());
          }
        });
        thet.streetView.addListener('pov_changed',() => {
          if (thet.props.onPovChanged) {
            thet.props.onPovChanged(thet.streetView.getPov());
          }
        });
      });
    }
  }

  componentDidMount () {
    this.initialize(ReactDOM.findDOMNode(this));
  }

  componentDidUpdate () {
    this.initialize(ReactDOM.findDOMNode(this));
  }
  componentWillUnmount () {
    if (this.streetView) {
      this.props.googleMaps.event.clearInstanceListeners(this.streetView);
    }
  }

  render () {
    return <div
      style = {{
        height: '100%'
      }}
    > </div>;
  }
}

if (typeof React.PropTypes !== 'undefined') {
  StreetView.defaultProps = {
    streetViewPanoramaOptions: {
      position: {lat: 0, lng: 0},
      pov: {heading: 0, pitch: 0},
      zoom: 1
    }
  };
}

function mapScriptsToProps (props) {
  const googleMapsApiKey = props.apiKey;
  return {
    googleMaps: {
      globalPath: 'google.maps',
      url: 'https://maps.googleapis.com/maps/api/js?key=' + googleMapsApiKey,
      jsonp: true
    }
  };
}

export default asyncLoading(mapScriptsToProps)(StreetView);


