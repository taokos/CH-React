import React, { Component } from 'react';
import Pager from 'react-pager';

const API = process.env.REACT_APP_SETTINGS_URL + '/api/v1/codehub/0';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchedResults: [],
      pieces: [],
      current: 0,
      visiblePage: 5,
      limit: 10,
    };
    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.limitChange = this.limitChange.bind(this);
  }

  getResults() {
    if (this.props.searching) {
      const requestUrl = API
        + '?search=' + this.props.searching
        + '&alias=/us/'
        + this.props.match.params.p1
        + '/'
        + this.props.match.params.p2
        + '&_format=json&l=' + this.state.limit
        + '&p=' + this.state.current;
      this.props.searching = '';
      fetch(requestUrl)
        .then(results => results.json())
        .then(data => this.setState({matchedResults: data}))
        .then(data => this.getParents())
        .catch((e) => {
          console.error(e);
        });
    }
  }

  getParents() {
    if (this.state.matchedResults.items.length > 0) {
      let breadcrumbs = [];
      let pieces = [];
      this.state.matchedResults.items.map((result) => {
        pieces = result.doc.path.split('/').filter(item => item !== '' && item !== result.doc.id);
        breadcrumbs += ',' + pieces;

        return breadcrumbs;
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

    for (let i in data.items) {
      let path = data.items[i].doc.path.split('/').filter(item => item !== '');
      for (let key in path) {
        if (typeof this.state.pieces[path[key]] !== 'undefined') {
          path[key] = (<a key={'link-'+ key} href={'#' + this.state.pieces[path[key]].path.split('/').join('\\')}>{this.state.pieces[path[key]].text}</a>);
        }
        else {
          path.splice(key, 1);
        }
      }

      // Hasn't parents.
      if (path.length <= 1) {
        data.items[i].doc.breadcrumbs = [(<a key={'link-'+ 1} href={'#' + data.items[i].doc.id}>{data.items[i].doc.text}</a>)];
      }
      // Has parents.
      else {
        data.items[i].doc.breadcrumbs = path.reverse();
      }
    }

    return data.items.map((result, i) =>
      <div key={'result-'+i} className="row">
        <div className="title">{result.doc.breadcrumbs[0]}</div>
        <div className="breadcrumbs">{result.doc.breadcrumbs}</div>
        <div className="matches" data-value={result.doc.path.replace('/', '\\')} key={i} dangerouslySetInnerHTML={{__html: result.highlight.text}} />
      </div>
    );
  }

  handlePageChanged(newPage) {
    this.setState({current : newPage});
    this.props.searching = this.props.lastSearch;
  }

  limitChange(limit) {
    const {current, matchedResults} = this.state;
    let states = {limit : limit};
    if ((current + 1) * limit > matchedResults.total && matchedResults.total > 0) {
      states['current'] = Math.ceil(matchedResults.total / limit) - 1;
    }
    this.setState(states);
    this.props.searching = this.props.lastSearch;
  }

  render() {
    // Just a check to prevent infinity loop of requests.
    this.getResults();

    const {matchedResults, limit, current} = this.state;
    const maybePluralize = (count, noun, suffix = 's') =>
      `${count} ${noun}${count !== 1 ? suffix : ''}`;
    const currentMax = (((current + 1) * limit) > matchedResults.total) ? matchedResults.total : (current + 1) * limit;

    return (
      <div key={new Date().getTime()} id="view-details">
        <div className="ch-results">
          <div className="ch-searching">Search Results for
            “{this.props.lastSearch}“
          </div>
          <div className="ch-total-results-wrapper">
            <div className="ch-total-results">That search
              returned {maybePluralize(matchedResults.total, 'result')}.
            </div>
            <div className="info-sort">
              <div className="showing">
                Showing results {current * limit + 1} - {currentMax} of {matchedResults.total}
              </div>
              <div className="filters">
                <div className="offset">
                  Results per page: <span className="current-limit">{limit}<i className="icon-b icon-b-sort-desc"></i></span>
                  <ul className="tools-popup">
                    <li onClick={() => {this.limitChange(10)}} className={limit == 10 ? "active" : undefined}>10</li>
                    <li onClick={() => {this.limitChange(25)}} className={limit == 25 ? "active" : undefined}>25</li>
                    <li onClick={() => {this.limitChange(50)}} className={limit == 50 ? "active" : undefined}>50</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="results">
            {this.prepareResults(matchedResults)}
          </div>
          <div className="pager-wrapper">
            <Pager
              total={Math.ceil(matchedResults.total / limit)}
              current={this.state.current}
              visiblePages={this.state.visiblePage}
              titles={{ prev: <i className="icon-b icon-b-prev"></i>, next: <i className="icon-b icon-b-next"></i> }}
              className="pagination-sm pull-right"
              onPageChanged={this.handlePageChanged}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResults;
