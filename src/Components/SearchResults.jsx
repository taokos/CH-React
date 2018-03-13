import React, { Component } from 'react';

const API = '/api/v1/codehub/0';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchedResults: [],
      pieces: [],
    };
  }

  getResults() {
    if (this.props.searching) {
      const requestUrl = API
        + '?search=' + this.props.searching
        + '&alias=/us/'
        + this.props.match.params.p1
        + '/'
        + this.props.match.params.p2
        + '&_format=json&l=10';
      this.props.searching = '';
      fetch(requestUrl)
        .then(results => results.json())
        .then(data => this.setState({matchedResults: data}))
        .then(data => this.getParents());
    }
  }

  getParents() {
    if (this.state.matchedResults.items.length > 0) {
      let breadcrumbs = [];
      let pieces = [];
      this.state.matchedResults.items.map((result) => {
        pieces = result.doc.path.split('/').filter(item => item !== '' && item !== result.doc.id);
        breadcrumbs += ',' + pieces;
      });

      const request = API
        + '?alias=/us/'
        + this.props.match.params.p1
        + '/'
        + this.props.match.params.p2
        + '&_format=json&ids='
        + breadcrumbs;

      fetch(request)
        .then(results => results.json())
        .then(data => this.setState({pieces: data}));
    }
  }

  prepareResults(data) {
    if (typeof data.items === 'undefined') {
      data.items = [];
    }
    if (this.state.pieces.length < 1) {
      return '';
    }

    for (let i in data.items) {
      let path = data.items[i].doc.path.split('/').filter(item => item !== '');
      for (let key in path) {
        if (typeof this.state.pieces[path[key]] !== 'undefined') {
          path[key] = (<a key={'link-'+ key} href={'#' + path[key]}>{this.state.pieces[path[key]].text}</a>);
        }
        else {
          delete path[key];
        }
      }

      // Hasn't parents.
      if (path.length <= 1) {
        data.items[i].doc.breadcrumbs = (<a key={'link-'+ 1} href={'#' + data.items[i].doc.id}>{data.items[i].doc.text}</a>);
      }
      // Has parents.
      else {
        data.items[i].doc.breadcrumbs = path.reverse();
      }
    }

    return data.items.map((result, i) =>
      <div key={'result-'+i}>
        <div className="breadcrumbs">{result.doc.breadcrumbs}</div>
        <div className="title">{result.doc.breadcrumbs[1]}</div>
        <div className="matches" data-value={result.doc.path} key={i} dangerouslySetInnerHTML={{__html: result.highlight.text}} />
      </div>
    );
  }

  render() {
    // Just a check to prevent infinity loop of requests.
    this.getResults();

    const {matchedResults} = this.state;
    const maybePluralize = (count, noun, suffix = 's') =>
      `${count} ${noun}${count !== 1 ? suffix : ''}`;

    return (
      <div key={this.props.lastSearch} id="view-details">
        <div className="ch-results">
          <div className="ch-searching">Search Results for
            “{this.props.lastSearch}“
          </div>
          <div className="ch-total-results">That search
            returned {maybePluralize(matchedResults.total, 'result')}.
          </div>
          {this.prepareResults(matchedResults)}
        </div>
      </div>
    );
  }
}

export default SearchResults;
