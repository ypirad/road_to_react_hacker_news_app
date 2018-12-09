import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const isSearched = searchTerm => item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase());

const Search = ({ value, onChange, children }) =>
      <form>
        {children}
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>;

const Table = ({ list, pattern, onDismiss }) =>
      <div className="table">
        {list.filter(isSearched(pattern)).map(
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
      // If the variable and state property share the same names, we can simply
      // use the name by itself.
      // I.e. "list" instead of "list: list"
      //
      list: list,
      searchTerm: '',
    };

    // this.onDismiss = this.onDismiss.bind(this);
    // Using ES6 arrow functions will automatically bind class methods to the
    // class instances, and we don't need to explicitly bind them in the class
    // constructor.
  }

  onDismiss = id => {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    // Alternatively, the previous two lines can combine like so...
    // updatedList = this.state.list.filter(item => item.objectID !== id);

    this.setState({ list: updatedList });
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

export default App;
