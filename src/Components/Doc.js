import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import SearchBox from './SearchBox';
import TreeView from 'react-simple-jstree';
import $ from 'jquery';
import HtmlToReact from 'html-to-react';
import CopyPopup from './Elements/CopyPopup';

const htmlToReactParser = new HtmlToReact.Parser(React);
const apiURL = process.env.REACT_APP_SETTINGS_URL + '/api/v1/codehub/0';

class Doc extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        core: {
          data: {
            url: function (node) {
              let url = "";
              if (node.id === '#') {
                url = apiURL
                  + '?alias=/us/'
                  + props.match.params.p1
                  + '/'
                  + props.match.params.p2
                  + '&topLevel=1'
                  + '&_format=json';
              }
              else {
                url = apiURL
                  + '?alias=/us/'
                  + props.match.params.p1
                  + '/'
                  + props.match.params.p2
                  + '&parentId=' + node.id
                  + '&_format=json';
              }

              return url;
            },
            success: function (new_data) {
              for (let i in new_data) {
                if (typeof new_data[i]['children'] === 'undefined') {
                  new_data[i]['children'] = true;
                }
                new_data[i]['li_attr']['path'] = new_data[i]['path'].split('/').join('\\');
                if (new_data[i]['li_attr']['dataTag'].indexOf('Body') !== -1) {
                  new_data[i]['state'] = {hidden: true};
                }
              }
              return new_data;
            }
          },
          check_callback: true
        }
      },
      selected: [],
      details: '',
    };
  }

  componentDidMount() {
    this.trackHash();
    let chDoc = this;
    $(this.treeContainer)
      .on('loaded.jstree', function(e, data) {
        // Invoked after jstree has loaded.
        chDoc.openTreeByPath(window.location.hash);
      })
      .on('select_node.jstree', function (e, data) {
        let objNode = data.instance.get_node(data.selected);
        data.instance.open_node(objNode);
        chDoc.getSelectedItem(data, objNode);
      })
      // Hide body from tree.
      .on('open_node.jstree', function (e, data) {
        if (data.node && data.node.children_d && data.node.children_d.length > 0) {
          data.node.children_d.forEach(function (c) {
            let child = data.instance.get_node([c]);
            if (child.li_attr.dataTag && child.li_attr.dataTag.indexOf('Body') !== -1) {
              data.instance.hide_node(child);
            }
          });

          let objNode = data.node;
          chDoc.getSelectedItem(data, objNode);
        }
      });
  }

  // Track change hash event.
  trackHash () {
    let chDoc = this;
    // Does the browser support the hashchange event?
    if ("onhashchange" in window) {
      window.onhashchange = function () {
        chDoc.openTreeByPath(window.location.hash);
      };
    }
    // Event not supported.
    else {
      let storedHash = window.location.hash;
      window.setInterval(function () {
        if (window.location.hash !== storedHash) {
          storedHash = window.location.hash;
          chDoc.openTreeByPath(window.location.hash);
        }
      }, 100);
    }
  }

  // Open tree by path and focus.
  openTreeByPath(path) {
    path = path.replace('#', '').split('\\');
    path = path.filter(function(item) {return item !== '';});

    if (path.length > 0) {
      let total = path.length - 1;
      let i = 0;
      $(this.treeContainer).jstree("open_node", document.getElementById(path[i]));
      i++;
      let interval_id = setInterval(function () {
        let child = document.getElementById(path[i]);
        if (child) {
          if (i <= total) {
            $(this.treeContainer).jstree("open_node", child);
            i++;
          }
          else {
            // Exit the interval loop with clearInterval command.
            clearInterval(interval_id);
          }
        }
      }, 100);
    }
  }

  // Show selected node children.
  getSelectedItem (data, objNode) {
    let text = [];
    if (objNode.text) {
      // Add with share link.
      text.push('<div><strong>' + objNode.text + '</strong><span className="share" data-id="'+objNode.id+'">Share</span><br /></div>');
    }
    if (objNode && objNode.children && objNode.children.length > 0) {
      this.getTextRecursively(data, objNode.children, text);
    }

    this.setState({details: text});
  }

  bindShareClick(e) {
    e.preventDefault();
    let elId = e.currentTarget.getAttribute('data-id');
    let path = $(this.treeContainer).jstree('get_node', elId);
    path = path['li_attr']['path'];
    const value = window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + path;
    ReactDOM.render(<CopyPopup value={value} />, document.getElementById('popup-container'));
  }

  getTextRecursively(data, el, text) {
    let table = [
      'Table',
      'TH',
      'TD',
      'TR'
    ];
    let image = ['BodyImage'];
    let elDoc = this;
    el.forEach(function (c) {
      // Process parents.
      let child = data.instance.get_node(c);

      let closeTag = '';

      // Build table (add the opening tag).
      if (child.li_attr && table.indexOf(child.li_attr.dataTag) !== -1) {
        closeTag = child.li_attr.dataTag;
        text.push('<' + child.li_attr.dataTag + '>');
        if (child.text) {
          text.push(child.text);
        }
      }
      else if (child.text) {
        // Process image.
        if (child.li_attr && image.indexOf(child.li_attr.dataTag) !== -1) {
          text.push('<img src="' + child.text + '"' + '>');
        }
        // Regular text.
        else {
          if (child.li_attr && (child.li_attr.dataTag === 'subsection' || child.li_attr.dataTag === 'section')) {
            // Add with share link.
            text.push('<p className="bold">' + child.text + '<span className="share" data-id="'+child.id+'">Share</span></p>');
          }
          else {
            text.push('<p>' + child.text + '</p>');
          }
        }
      }

      // Process children.
      if (child.children && child.children.length > 0) {
        elDoc.getTextRecursively(data, child.children, text);
      }

      // Build table (add the closing tag).
      if (closeTag) {
        text.push('</' + closeTag + '>');
      }
    });
  }

  handleChange(e, data) {
    this.setState({
      selected: data.selected,
    });
  }

  render() {
    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
    const processingInstructions = [
      {
        // Custom <h1> processing
        shouldProcessNode: function(node) {
          return node.parent && node.parent.name
            && node.parent.name === 'span'
            && node.parent.attribs
            && node.parent.attribs.classname
            && node.parent.attribs.classname === 'share';
        },
        processNode: (node, children) => {
          let el =  React.createElement('a', {
              'href': '#share',
              'onClick': this.bindShareClick.bind(this),
              'data-id': node.parent.attribs['data-id']
            }, <i class="icon-b icon-b-chain"></i>);
          return el;
        }
      }, {
        // Anything else
        shouldProcessNode: function(node) {
          return true;
        },
        processNode: processNodeDefinitions.processDefaultNode
      }];
    const data = this.state.data;
    const details = this.state.details ? this.state.details.join('') : '';
    const isValidNode = function() {
      return true;
    };
    let reactComponent = ''
    if (details) {
      reactComponent = htmlToReactParser.parseWithInstructions(details, isValidNode, processingInstructions);
    }

    return (
      <div className="ch-doc">
        <SearchBox history={this.props.history} match={this.props.match}/>
        <div className="tree">
          <div id="json-view" className="view-page jstree">
            <TreeView
              ref={(el) => {el ? this.treeContainer = el.treeContainer : '';}}
              treeData={data}
              onChange={(e, data) => this.handleChange(e, data)}
            />
          </div>
          <div key={new Date().getTime()} id="view-body" className="view-body">
            <div id="view-details" className="view-details">
              {reactComponent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Doc;
