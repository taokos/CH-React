import React, { PropTypes, Component } from 'react';

class MapSearch extends React.Component {

  constructor() {
    super();
    this.searchKeyPress = this.searchKeyPress.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.getApiData = this.getApiData.bind(this);
    this.state = {
      options: [],
      value: '',
      plases: []
    };
  };

  handleComplete(e) {
    this.setState({'plases': []});
    if ('target' in e && this.props.getPropertyLayer) {
      this.props.getPropertyLayer(e.target.textContent);
    }
  }

  getApiData(key) {
    fetch(process.env.REACT_APP_API +'/fast-ajax/autocomplete?field=address&place=' + process.env.REACT_APP_PLACE_ID + '&search=' + key)
      .then(results => results.json())
      .then(data => this.SaveResult(data));
  }

  SaveResult(data) {
    if (data && data[0]) {
      this.setState({'plases': data});
    }
  }

  searchKeyPress(e) {
    if (typeof e !== 'undefined' && 'target' in e) {
      this.setState({'value': e.target.value});
      this.getApiData(e.target.value);
    }
  }

  render() {
    const clickItem = this.handleComplete;
    return (
      <div className="map-search-box">
        <input type={'text'} onKeyDown={this.searchKeyPress} />
        <ul>
        {this.state.plases.map(function(item, id) {
            return (
              <li key={'field-' + id} onClick={clickItem}>
                {item.text}
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default MapSearch;
