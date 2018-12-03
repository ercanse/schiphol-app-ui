import React from 'react';
import ReactDOM from 'react-dom';
import ToggleButton from './toggleButton';
import DatePickerComponent from './datePickerComponent';
import Container from './container';
import * as serviceWorker from './serviceWorker';

import './index.css';

ReactDOM.render(<ToggleButton/>, document.getElementById('toggleButton'));
ReactDOM.render(<DatePickerComponent/>, document.getElementById('datePicker'));
ReactDOM.render(<Container/>, document.getElementById('root'));

serviceWorker.unregister();
