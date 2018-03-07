import React, { Component } from 'react';
import SearchBox from './SearchBox'

class Doc extends Component {
  render() {
    return (
      <div className="ch-doc">
        <SearchBox history={this.props.history} match={this.props.match}/>
      </div>
    )
  }
}

export default Doc;
