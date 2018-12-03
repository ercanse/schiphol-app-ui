import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PubSub from 'pubsub-js';
import config from './config';

import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios/index";

class DatePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightDates: [],
            date: moment().subtract(1, 'days')
        };
        this.handleChange = this.handleChange.bind(this);
        this.loadData();
    }

    loadData() {
        axios.get(config.backEndUrl + "getDates").then(response => this.setState({
            highlightDates: response.data
        }));
    }

    handleChange(date) {
        this.setState({
            date: date
        });
        PubSub.publish('dateTopic', date);
    }

    render() {
        if (this.state.highlightDates.length === 0) {
            return <div><p>Loading...</p></div>;
        }

        var highlightDates = [];
        for (var i in this.state.highlightDates) {
            var highlightDateString = this.state.highlightDates[i];
            highlightDates.push(moment(highlightDateString, "YYYY-MM-DD"));
        }

        return <div>
            <span><p>Selected date:</p></span>
            <DatePicker
                selected={this.state.date}
                onChange={this.handleChange}
                dateFormat={this.dateFormat}
                highlightDates={highlightDates}
            />
        </div>;
    }
}

export default DatePickerComponent;
