import React from 'react';
import ReactDOM from 'react-dom';

import Canvas from './Canvas/Canvas'

import './style.scss'

const App = () => (
   <div>
       <Canvas />
   </div>
)
ReactDOM.render(<App/>, document.getElementById('root'));
