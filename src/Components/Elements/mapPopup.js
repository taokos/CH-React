import React from 'react';

class mapPopup extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    const data = this.props.popupData;
    return (
      <div className={"mapPopup " + data.popupClass}>
        <header>
          <h2>{data.title}</h2>
        </header>
        <div className={'modalContent'}>
          {data.content}
        </div>
        <footer>
          {data.footer}
        </footer>
      </div>
    )
  };
}

export default mapPopup;
