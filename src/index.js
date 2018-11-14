import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Chart from './chart';
import DatePickerComponent from './DatePickerComponent';
import CirclePack from './circlePack';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<Chart/>, document.getElementById('root'));
ReactDOM.render(<CirclePack/>, document.getElementById('root'));
ReactDOM.render(<DatePickerComponent/>, document.getElementById('datePicker'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
