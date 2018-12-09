import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const Search = ({ value, onChange, onSubmit, children }) =>
      <form onSubmit={onSubmit}>
        {children}
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
        <Button
          type="submit"
        >
          {children}
        </Button>
      </form>;

const Table = ({ list, onDismiss }) =>
      <div className="table">
        {list.map(
          item =>
            <div key={item.objectID} className="table-row">
              <span style={{ width: '40%' }}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={{ width : '30%' }}>
                {item.author}
              </span>
              <span style={{ width : '10%' }}>
                {item.num_comments}
              </span>
              <span style={{ width : '10%' }}>
                {item.points}
              </span>
              <span style={{ width : '10%' }} >
                <Button
                  onClick={() => onDismiss(item.objectID)}
                  className="button-inline"
                  type="button"
                >
                  Dismiss
                </Button>
              </span>
            </div>
        )}
      </div>;

const Button = ({ onClick, className = '', children  }) =>
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    // this.onDismiss = this.onDismiss.bind(this);
    // Using ES6 arrow functions will automatically bind class methods to the
    // class instances, and we don't need to explicitly bind them in the class
    // constructor.
  }

  onDismiss = id => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    // Alternatively, the previous two lines can combine like so...
    // updatedList = this.state.list.filter(item => item.objectID !== id);

    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories = result => {
    this.setState({ result });
  }

  fetchSearchTopStories = searchTerm => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  componentDidMount = () => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit = event => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  render() {
    const { searchTerm, result } = this.state;

    if (!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        }
      </div>
    );
  }
}

export default App;
