import React, {Component} from 'react';
import copy from 'copy-to-clipboard';
import PopupBase from '../../../Elements/PopupBase.js';

export default class CopyPopup extends Component {

  copy(e, val) {
    copy(val, {message: 'sss'});
  }

  render() {
    return (
      <PopupBase title="Share Link" className="copy-popup">
        <input disabled value={this.props.value} type="text" className="copy-value" />
        <button onClick={(e) => {this.copy(e, this.props.value)}} className="btn copy small">Copy</button>
      </PopupBase>
    );
  }
}
