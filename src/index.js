import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
} from "react-router-dom";

import Home from './Home/Home'
import Snake from './Snake/Snake'
import Minesweeper from './Minesweeper/Minesweeper'

import './style.scss'

const App = () => (
    <Router>
        <div>
            <Route path="/" exact component={Home} />
            <Route path="/snake" exact component={Snake} />
            <Route path="/minesweeper" exact component={Minesweeper} />
        </div>
    </Router>
)
ReactDOM.render(<App />, document.getElementById('root'));
