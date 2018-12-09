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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // If the variable and state property share the same names, we can simply
      // use the name by itself.
      // I.e. "list" instead of "list: list"
      //
      list: list,
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

  render() {
    return (
      <div className="App">
        {this.state.list.map(item =>
                             <div key={item.objectID}>
                               <span>
                                 <a href={item.url}>{item.title}</a>
                               </span>
                               <span>{item.author}</span>
                               <span>{item.num_comments}</span>
                               <span>{item.points}</span>
                               <span>
                                 <button
                             // It's important we bind a function,
                             // i.e. defined below via ES6 arrow syntax,
                             // to the onClick event instead of just the code
                             // expression. Otherwise, the code gets evaluated
                             // upon page load but not when clicking the
                             // button.
                                   onClick={() => this.onDismiss(item.objectID)}
                                   type="button"
                                 >
                                   Dismiss
                                 </button>
                               </span>
                             </div>
                            )}
      </div>
    );
  }
}

export default App;
