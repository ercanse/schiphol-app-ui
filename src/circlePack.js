import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import PubSub from 'pubsub-js';
import ReactD3Pack from './ReactD3Pack';

class CirclePack extends Component {
    constructor(props) {
        super(props);
        this.dateFormat = "YYYY-MM-DD";
        this.state = {data: [], date: moment().subtract(1, 'days').format(this.dateFormat), token: null};
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
        axios.get("http://localhost:8080/getDestinationsByPierOnDate?date=" + this.state.date).then(response => this.setState({
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
        // var data = {
        //     "name": "Piers",
        //     "children": [
        //         {
        //             "name": "Pier A",
        //             "children": [
        //                 {
        //                     "name": "Berlin",
        //                     "size": 200
        //                 },
        //                 {
        //                     "name": "Paris",
        //                     "size": 100
        //                 }
        //             ]
        //         }, {
        //             "name": "Pier B",
        //             "children": [
        //                 {
        //                     "name": "London",
        //                     "size": 300
        //                 },
        //                 {
        //                     "name": "Oslo",
        //                     "size": 50
        //                 }
        //             ]
        //         }]
        // };

        return <div>
            <div style={{width: '100%'}}>
                <ReactD3Pack data={data}/>
            </div>
        </div>;
    }
}

export default CirclePack;
