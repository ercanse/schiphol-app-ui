import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PubSub from 'pubsub-js';

import 'react-datepicker/dist/react-datepicker.css';

class DatePickerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().subtract(1, 'days')
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            date: date
        });
        console.log(date);
        PubSub.publish('dateTopic', date);
    }

    render() {
        return <div>
            <span><p>Selected date:</p></span>
            <DatePicker
                selected={this.state.date}
                onChange={this.handleChange}
                dateFormat={this.dateFormat}
            />
        </div>;
    }
}

export default DatePickerComponent;
