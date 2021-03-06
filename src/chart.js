import React, {Component} from 'react';
import {scaleBand, scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {select} from 'd3-selection';
import axios from 'axios';
import moment from 'moment';
import PubSub from 'pubsub-js';
import config from './config';

import './chart.css';

class BarChart extends Component {
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
        axios.get(config.backEndUrl + "getFlightsByPierOnDate?date=" + this.state.date).then(response => this.setState({
            data: response.data
        }));
    }

    render() {
        if (this.state.data.length === 0) {
            return <div><p>No data found for {this.state.date}</p></div>;
        }

        const svgWidth = 960, svgHeight = 500;
        const margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom;
        const x = scaleBand().rangeRound([0, width]).padding(0.1),
            y = scaleLinear().rangeRound([height, 0]);

        var data = this.state.data;
        x.domain(data.map(d => d.pier));
        y.domain([0, max(data, d => d.flights)]);

        return <svg width={svgWidth} height={svgHeight}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <g
                    className="axis axis--x"
                    transform={`translate(0, ${height})`}
                    ref={node => select(node).call(axisBottom(x))}
                />
                <g className="axis axis--y">
                    <g ref={node => select(node).call(axisLeft(y).ticks(10))}/>
                    {}
                    <text transform="rotate(-90)" y="6" dy="0.71em" textAnchor="end">
                        Flights
                    </text>
                </g>
                <g>
                    <text x={width - 20} y={height - 30} dy="0.71em" textAnchor="end">
                        Pier
                    </text>
                </g>
                <g>
                    <text x={width / 2} y={0 - (margin.top / 2)} dy="0.71em" textAnchor="middle"
                          textDecoration="underline">
                        Flights by pier
                    </text>
                </g>
                {data.map(d => (
                    <rect
                        key={d.pier}
                        className="bar"
                        x={x(d.pier)}
                        y={y(d.flights)}
                        width={x.bandwidth()}
                        height={height - y(d.flights)}
                    />
                ))}
            </g>
        </svg>;
    }
}

export default BarChart;
