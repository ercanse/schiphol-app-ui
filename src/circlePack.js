import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import PubSub from 'pubsub-js';
import ReactD3Pack from './reactD3Pack';
import config from './config';

class CirclePack extends Component {
    constructor(props) {
        super(props);
        this.dateFormat = "YYYY-MM-DD";
        var date = moment().subtract(1, 'days');
        if ("date" in props) {
            date = props.date;
        }
        this.state = {data: [], date: date.format(this.dateFormat), token: null};
        this.loadData();
    }

    componentDidMount() {
        var self = this;
        var dateListener = function (msg, data) {
            var date = moment(data).format(self.dateFormat);
            self.setState({date: date});
            self.loadData();
        };
        var token = PubSub.subscribe('dateTopic', dateListener);
        self.setState({token: token});
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.state.token);
    }

    loadData() {
        axios.get(config.backEndUrl + "getDestinationsByPierOnDate?date=" + this.state.date).then(response => this.setState({
            data: response.data
        }));
    }

    processData() {
        var circlePackData = {name: "Piers", children: []};

        var data = this.state.data;
        for (var key in data) {
            var entry = data[key];
            var children = [];
            for (var item in entry) {
                children.push({name: item, size: entry[item]});
            }

            var pierData = {name: key, children: children};
            circlePackData.children.push(pierData);
        }

        return circlePackData;
    }

    render() {
        var data = this.processData();
        return <div>
            <div style={{width: '85%'}}>
                <p>Destinations by pier</p>
                <ReactD3Pack data={data}/>
            </div>
        </div>;
    }
}

export default CirclePack;
