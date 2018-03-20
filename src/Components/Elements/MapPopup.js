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
    document.body.classList.add('properties-enabled');
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handlerEsc.bind(this));
    document.body.classList.remove('properties-enabled');
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
      addressControl: false,
      zoom: 1
    };
    const ItemTitle = ['title','city','state', 'postalCode'].map(function(el) {
      if (el in item && item[el] !== null && item[el] !== '') {
        el = item[el];
        if (typeof el === 'object') {
          el = el.join(', ');
        }
      }
      else {
        el = '';
      }
      return el;
    }).filter(function(el) {return el !== '';}).join(', ');

    return (
      <div className="map-modal-wrapper left-overlay">
        <div className="head-title">
          <h3>{ItemTitle}</h3>
          <button className="button-link close" onClick={() => this.onCloseClicked()}>
            <i className="icon-b icon-b-close" />
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
            <div className="street-view" style={{'height':'200px'}}>
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
                            let hasResult = value.fields.filter(
                              function(field) {
                                return (field in item) && item[field] != null;
                              }
                            );
                          if (value.title !== '' && hasResult.length > 0) {
                            i++;
                            let result = hasResult.map((resultField) => {
                              if (typeof item[resultField] === 'object') {
                                item[resultField] = item[resultField].join(', ');
                              }
                              return item[resultField];
                            }).join(', ');
                            return (
                              <div key={'field-' + value.fields.join('-')} className={'item ' + (i % 2 == 0 ? 'even' : 'odd')}>
                                <span className="lbl">{value.title}:</span>
                                <span className="value">
                                  {value.prefix}
                                  {result}
                                  {value.suffix}
                                </span>
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
          <div className={"zoning-tab tab"  + (activeTab === 'zoning' ? '' : ' hide')}>
            <div className="building-scenario">
              <div className="title">Building Scenario</div>
              <a className="btn" target="_blank" href={process.env.REACT_APP_ZONAR}>Learn More</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MapPopup;
