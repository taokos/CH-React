import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class PopupBase extends Component {

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.handlerEsc = this.handlerEsc.bind(this);
  }

  close() {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handlerEsc);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlerEsc);
  }

  switchTab(e, tab) {
    e.preventDefault();
    this.setState({activeTab: tab});
  }

  handlerEsc(evt) {
    let isEscape = false;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    }
    else {
      isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
      this.close();
    }
  }

  render() {
    return (
      <div className={this.props.className ? "popup " + this.props.className : "popup" }>
        <div className="popup-header">
          <h3>{this.props.title}</h3>
          <button className="button-link close" onClick={() => this.close()}>
            <i className="icon-b icon-b-close"></i>
          </button>
        </div>
        <div className="popup-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
