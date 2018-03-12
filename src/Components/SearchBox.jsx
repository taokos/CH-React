import React, { Component } from 'react';

class SearchBox extends Component {
  render() {
    return (
      <div className="search-box">
        <form method="GET" action={'/us/' + this.props.match.params.p1 + '/' + this.props.match.params.p2 + '/search'}>
          <input name="search" type="search" placeholder="Search" ref="search"/>
        </form>
      </div>
    )
  }
}

export default SearchBox;
