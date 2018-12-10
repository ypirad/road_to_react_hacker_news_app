import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class Search extends Component {
  componentDidMount() {
    if(this.input) {
      this.input.focus();
    }
  }

  render() {
    const { value,
            onChange,
            onSubmit,
            children
          } = this.props;

    return (
      <form onSubmit={onSubmit}>
        {children}
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(node) => { this.input = node; }}
        />
        <Button
          type="submit"
        >
          {children}
        </Button>
      </form>
    );
  }
}

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

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

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const Button = ({ onClick, className, children  }) =>
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>;

Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Loading = () =>
      <div>Loading ...</div>;

const withLoading = (Component) => ({ isLoading, ...rest }) =>
      isLoading
      ? <Loading />
      : <Component { ...rest } />;

const ButtonWithLoading = withLoading(Button);

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    // this.onDismiss = this.onDismiss.bind(this);
    // Using ES6 arrow functions will automatically bind class methods to the
    // class instances, and we don't need to explicitly bind them in the class
    // constructor.
  }

  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    // Alternatively, the previous two lines can combine like so...
    // updatedList = this.state.list.filter(item => item.objectID !== id);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }

  setSearchTopStories = result => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
          ? results[searchKey].hits
          : [];

    const updatedHits = [ ...oldHits, ...hits ];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    });
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  componentDidMount = () => {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  needsToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit = event => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    const page = (results &&
                  results[searchKey] &&
                  results[searchKey].page
                 ) || 0;
    const list = ( results &&
                   results[searchKey] &&
                   results[searchKey].hits
                 ) || [];

    if (error) {
      return <p>Something went wrong.</p>;
    }

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
        { error
          ? <div classname="interactions">
              <p>Something went wrong.</p>
            </div>
          : <Table
              list={list}
              onDismiss={this.onDismiss}
            />
        }
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;

export {
  Button,
  Search,
  Table,
};
