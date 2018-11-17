import React from 'react';
import ReactDOM from 'react-dom';
import {Route} from "react-router";
import {HashRouter} from "react-router-dom";
import Chart from './chart';
import DatePickerComponent from './DatePickerComponent';
import CirclePack from './circlePack';
import * as serviceWorker from './serviceWorker';

import './index.css';

ReactDOM.render(
    (
        <HashRouter>
            <div>
                <Route exact path="/" component={CirclePack}/>
                <Route path="/chart" component={Chart}/>
            </div>
        </HashRouter>
    ),
    document.getElementById('root'));
ReactDOM.render(<DatePickerComponent/>, document.getElementById('datePicker'));

serviceWorker.unregister();
