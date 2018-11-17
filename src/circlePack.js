import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import PubSub from 'pubsub-js';
import ReactD3Pack from './ReactD3Pack';

class CirclePack extends Component {
    constructor(props) {
        super(props);
        this.dateFormat = "YYYY-MM-DD";
        this.state = {data: [], date: moment().subtract(1, 'days').format(this.dateFormat)};

        this.loadData();

        var self = this;
        var dateListener = function (msg, data) {
            var date = moment(data).format(self.dateFormat);
            self.setState({date: date});
            self.loadData();
        };
        PubSub.subscribe('dateTopic', dateListener);
    }

    loadData() {
        axios.get("http://localhost:8080/getFlightsByPierOnDate?date=" + this.state.date).then(response => this.setState({
            data: response.data
        }));
    }

    render() {
        var data = {
            "name": "Piers",
            "children": [
                {
                    "name": "Pier A",
                    "children": [
                        {
                            "name": "Berlin",
                            "size": 200
                        },
                        {
                            "name": "Paris",
                            "size": 100
                        }
                    ]
                }, {
                    "name": "Pier B",
                    "children": [
                        {
                            "name": "London",
                            "size": 300
                        },
                        {
                            "name": "Oslo",
                            "size": 50
                        }
                    ]
                }]
        };

        return <div>
            <button className="btn btn-warning"
                    onClick={this.toggle.bind(this)}>Toggle Short/Long data
            </button>
            <div style={{width: '100%'}}>
                <ReactD3Pack data={data}/>
            </div>
        </div>;
    }

    toggle() {
        this.props.history.push({
            pathname: "/chart"
        });
    }
}

export default CirclePack;
