import React from 'react';
import './App.css';
import Entry from './Entry';
import Home from './Home';
import googleAuth from './authorization/googleAuth'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
class App extends React.Component {
  render() {
    return (
        <Router>
          <div className="App">
              <Switch>
                  <Route path="/" exact component={Entry} />
                  <Route path="/entry" component={Entry} />
                  <Route path="/home" component={Home} />
                  <Route path="/google" component={googleAuth} />
              </Switch>
          </div>
        </Router>
    );
  }

}


export default App;
