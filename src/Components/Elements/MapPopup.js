import React from 'react';
import StreetView from './StreetView.js';
import _ from 'underscore';

class MapPopup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      'activeTab': 'properties'
    };
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handlerEsc.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handlerEsc.bind(this));
  }

  switchTab(e, tab) {
    e.preventDefault();
    this.setState({activeTab: tab});
  }

  _handlerEsc(evt) {
    let isEscape = false;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
      isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
      this.props.onCloseClicked();
    }
  }

  onCloseClicked() {
    if (this.props.onCloseClicked) {
      this.props.onCloseClicked();
    }
  }

  render() {
    const popupData = this.props.popupData;

    let cityAddress = '';
    popupData['address'].map(function(item){
      cityAddress += ', ' + item;
    });

    const item = popupData.data.data.items[0];
    const googleMapsApiKey = popupData['googleApiKey'];
    const activeTab = this.state.activeTab;
    const streetViewPanoramaOptions = {
      position: {lat: popupData.lat, lng: popupData.lng},
      pov: {heading: 100, pitch: 0},
      zoom: 1
    };

    return (
      <div className="map-modal-wrapper left-overlay">
        <div className="head-title">
          <h3>{item.title}</h3>
          <button className="button-link close" onClick={() => this.onCloseClicked()}>
            <i className="icon-b icon-b-close"></i>
          </button>
        </div>
        <div className="tabs">
          <a href="#properties" className={"properties-tab-link" + (activeTab == 'properties' ? ' active' : '')} onClick={(e) => this.switchTab(e, 'properties')}>
            Property Details
          </a>
          <a href="#zoning" className={"zoning-tab-link" + (activeTab == 'zoning' ? ' active' : '')} onClick={(e) => this.switchTab(e, 'zoning')}>
            Zoning Allowances
          </a>
        </div>
        <div className="overlay-content">
          <div className={"properties-tab tab" + (activeTab == 'properties' ? '' : ' hide')}>
            <div style={{'height':'200px'}}>
              <StreetView
                apiKey={googleMapsApiKey}
                streetViewPanoramaOptions={streetViewPanoramaOptions}
                onPositionChanged={position => this.setState({position: position})}
                onPovChanged={pov => this.setState({pov: pov})}
                address={item.address + cityAddress}
              />
            </div>
            <div className="tables">
              {
                _.values(_.mapObject(popupData.fields, function (value, key) {
                  let i = 0;
                  return (
                    <div key={key} className="table">
                      <div className="caption">
                        {key}
                      </div>
                      <div className="properties">
                        {
                          _.values(_.mapObject(value, function (value, key) {
                          if (value !== '' && key in item) {
                            i++;
                            return (
                              <div key={'field-' + key} className={'item ' + (i % 2 == 0 ? 'even' : 'odd')}>
                                <span className="lbl">{value}:</span>
                                <span className="value">{item[key]}</span>
                              </div>
                            );
                          }
                        }))}
                      </div>
                    </div>
                  );
                }))
              }
            </div>
          </div>
          <div className={"zoning-tab tab"  + (activeTab == 'zoning' ? '' : ' hide')}>
            <div className="building-scenario">
              <div className="title">Building Scenario</div>
              <a className="btn" target="_blank" href={process.env.REACT_APP_GRIDICS + item.title_uri}>Learn More</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MapPopup;
