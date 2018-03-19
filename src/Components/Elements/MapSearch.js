import React, { PropTypes, Component } from 'react';

class MapSearch extends React.Component {

  constructor() {
    super();
    this.searchKeyPress = this.searchKeyPress.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.getApiData = this.getApiData.bind(this);

    // Saved searches.
    this.searches = {};

    // Initial state.
    this.state = {
      options: [],
      value: '',
      places: [],
    };
  };

  handleComplete(e) {
    this.setState({
      'places': [],
      'value': ''
    });
    if ('target' in e && this.props.getPropertyLayer) {
      this.props.getPropertyLayer(e.target.textContent);
    }
  }

  handleBlur(e) {
    this.setState({
      'places': [],
    });
  }

  getApiData(key) {
    const that = this;
    fetch(process.env.REACT_APP_API +'/fast-ajax/autocomplete?field=address&place=' + process.env.REACT_APP_PLACE_ID + '&search=' + key)
      .then(results => results.json())
      .then(function (responce) {
        const data = responce && responce[0] ? responce : [];
        that.searches[key] = data;
        that.setState({'places': data});
      });
  }

  searchKeyPress(e) {
    if (typeof e !== 'undefined' && 'target' in e) {
      const val = e.target.value;
      this.setState({'value': val});
      if (this.searches[val]) {
        this.setState({'places': this.searches[val]});
      }
      else {
        this.getApiData(e.target.value);
      }
    }
  }

  render() {
    const clickItem = this.handleComplete;
    return (
      <div className="map-search-box">
        <div className="search-box">
          <input type={'text'}
             onFocus={this.searchKeyPress}
             onKeyUp={this.searchKeyPress} />
          <button className="search"><i className="icon-b icon-b-ic-search-grey-big"></i></button>
        </div>
        {(this.state.value.length > 0 && this.state.places.length > 0) && (
          <ul>
            {this.state.places.map(function(item, id) {
              return (
                <li key={'field-' + id} onClick={clickItem}>
                  {item.text}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

export default MapSearch;
