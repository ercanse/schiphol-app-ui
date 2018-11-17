import React from 'react';
import ReactDOM from 'react-dom';
import Container from './Container';
import DatePickerComponent from './DatePickerComponent';
import * as serviceWorker from './serviceWorker';

import './index.css';

ReactDOM.render(<Container/>, document.getElementById('root'));
ReactDOM.render(<DatePickerComponent/>, document.getElementById('datePicker'));

serviceWorker.unregister();
