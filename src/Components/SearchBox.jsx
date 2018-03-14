import React, { Component } from 'react';
import ReactDOM from "react-dom";
import SearchResults from "./SearchResults";

class SearchBox extends Component {

  constructor() {
    super();
    this.submitHandler = this.submitHandler.bind(this);
  }

  submitHandler(e) {
    e.preventDefault();
    const data = new FormData(e.target).get('search');
    if (data) {
      this.props.searching = data;
      this.props.lastSearch = data;
      ReactDOM.render(
        <SearchResults {...this.props}/>, document.getElementById('view-body'));
    }
  }

  render() {
    return (
      <div className="search-box">
        <form onSubmit={this.submitHandler} {...this.props} method="GET" action={'/us/' + this.props.match.params.p1 + '/' + this.props.match.params.p2}>
          <input name="search" type="search" placeholder="Search" ref="search"/>
        </form>
      </div>
    );
  }
}

export default SearchBox;
