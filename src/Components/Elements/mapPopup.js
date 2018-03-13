import React from 'react';

class MapPopup extends React.Component {

  componentWillMount() {
    document.addEventListener("keydown", this._handlerEsc.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handlerEsc.bind(this));
  }

  _handlerEsc(evt) {
    let isEscape = false;
    if ("key" in evt) {
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
      isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
      this.props.onCloseClicked();
    }
  }

  onCloseClicked() {
    if (this.props.onCloseClicked) {
      this.props.onCloseClicked();
    }
  }

  render() {

    const popupData = this.props.popupData;
    const item = popupData.data.data.items[0];

    return (
      <section className="map-modal-wrapper" style={{'position':'absolute', 'z-index':'9999', 'background':'#fff'}}>
        <div className="map-modal">
          <header>
            {item.title}
            <a
              role="button"
              className="skylight-close-button"
              onClick={() => this.onCloseClicked()}
            >
              &times;
            </a>
          </header>
          <div className={'modal-content'}>
            {popupData.fields.map(function(value, id) {
              if (value[0] === 'title') {
                return ('')
              }
              else if (value[0] in item) {
              return (
                <div key={'field-' + id}>
                  <label>{value[1]}</label>
                  <div>{item[value[0]]}</div>
                </div>
              )
            }})}
          </div>
        </div>
      </section>
    );
  }
}

export default MapPopup;
