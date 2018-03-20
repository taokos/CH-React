import React from 'react';

class MapSearch extends React.Component {

  constructor() {
    super();
    this.searchKeyPress = this.searchKeyPress.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.getApiData = this.getApiData.bind(this);

    // Saved searches.
    this.searches = {};

    // Initial state.
    this.state = {
      options: [],
      value: '',
      class: '',
      places: [],
      cursor: -1
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
    this.setState({'class': ''});
  }

  handleFocus(e) {
    this.setState({'class': ' focus'});
    this.searchKeyPress(e);
  }

  getApiData(key) {
    fetch(process.env.REACT_APP_API +'/fast-ajax/autocomplete?field=address&place=' + process.env.REACT_APP_PLACE_ID + '&search=' + key)
      .then(results => results.json())
      .then((responce) => {
        const data = responce && responce[0] ? responce : [];
        this.searches[key] = data;
        let cursor = this.state.cursor;
        if (data.length < cursor + 1) {
          this.setState({cursor: -1});
        }
        this.setState({
          'places': data
        });
      });
  }

  searchKeyPress(e) {
    let {cursor} = this.state;
    if (typeof e !== 'undefined' && 'target' in e) {
      const val = e.target.value;
      this.setState({'value': val});
      if (this.searches[val]) {
        if (this.searches[val].length < cursor + 1) {
          this.setState({cursor: -1});
        }
        this.setState({
          'places': this.searches[val]
        });
      }
      else {
        this.getApiData(e.target.value);
      }
      if (this.list) {
        switch (e.keyCode) {
          case 40:
            e.preventDefault();
            if (cursor < this.list.children.length - 1) {
              this.setState( prevState => ({
                cursor: prevState.cursor + 1
              }));
            }
            break;

          case 38:
            e.preventDefault();
            if (cursor > 0) {
              this.setState(prevState => ({
                cursor: prevState.cursor - 1
              }));
            }
            break;

          case 13:
            if (this.list.children[cursor]) {
              this.list.children[cursor].click();
            }
            break;
        }
      }
    }
  }

  render() {
    const clickItem = this.handleComplete;
    return (
      <div className={"map-search-box" + this.state.class}>
        <div className="search-box">
          <input type={'text'}
             placeholder="Search"
             onBlur={this.handleBlur.bind(this)}
             onFocus={this.handleFocus.bind(this)}
             onKeyUp={this.searchKeyPress} />
          <button className="search"><i className="icon-b icon-b-ic-search-grey-big"> </i></button>
        </div>
        {(this.state.value.length > 0 && this.state.places.length > 0) && (
          <ul ref={(el) => {this.list = el}}>
            {this.state.places.map((item, id) => {
              return (
                <li key={'item-' + id} className={this.state.cursor === id ? 'active' : ''} onClick={clickItem}>
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
