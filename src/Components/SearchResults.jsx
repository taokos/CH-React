import React, { Component } from 'react';

const API = '/api/v1/codehub/0';

class SearchResults extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      matchedResults: [],
    };
  }

  componentDidMount() {
    fetch(API + this.props.history.location.search + '&alias=/us/' + this.props.match.params.p1+ '/'+ this.props.match.params.p2 + '&_format=json')
      .then(results => results.json())
      .then(data => this.setState({ matchedResults: data}))
  }
  
  prepareResults(data) {
    return data.map((result, i) =>
      <div data-value={result.doc.path} key={i}>{result.highlight.text}</div>
    );
  }

  render() {
    const { matchedResults } = this.state;
    return (
      <div className="ch-results">
        {this.prepareResults(matchedResults)}
      </div>
    );
    
  }
}

export default SearchResults;
