import React from 'react';
import $ from 'jquery';

class HelpSearch extends React.Component {

  constructor() {
    super();
    this.searchKeyPress = this.searchKeyPress.bind(this);
  };

  searchKeyPress(e) {
    if (typeof e !== 'undefined' && 'target' in e) {
      const val = e.target.value;
      if (val.length > 2) {
        $('.help .collapsible-group').each(function () {
          const itemText = $(this).html();
          if (itemText.toLowerCase().indexOf(val.toLowerCase()) < 0) {
            $(this).hide();
          } else {
            $(this).show();
          }
        });
      }
      else {
        $('.help .collapsible-group').each(function () {
          $(this).show();
        });
      }
    }
  }

  render() {
    return (
      <div className={"help-search-box"}>
        <div className="search-box">
          <input type={'text'}
             placeholder="Search"
             onKeyUp={this.searchKeyPress} />
          <i className="icon-b icon-b-ic-search-grey-big"> </i>
        </div>
      </div>
    );
  }
}

export default HelpSearch;
