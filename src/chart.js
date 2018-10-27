import React, {Component} from 'react';
import {scaleBand, scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {select} from 'd3-selection';
import axios from 'axios';
import moment from 'moment';
import PubSub from 'pubsub-js';

import './chart.css';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.dateFormat = "YYYY-MM-DD";
        this.state = {data: [], date: moment().format(this.dateFormat)};

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
        axios.get("http://localhost:8080/test?date=" + this.state.date).then(response => this.setState({
            data: response.data,
            date: this.state.date
        }));
        console.log(this.state.date);
    }

    render() {
        if (this.state.data.length === 0) {
            return <div>Loading...</div>;
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
