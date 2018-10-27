import React, {Component} from 'react';
import {scaleBand, scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';
import {select} from 'd3-selection';
import axios from 'axios';

import './chart.css';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
        this.loadData();
    }

    loadData() {
        axios.get("http://localhost:8080/test").then(response => this.setState({data: response.data}));
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
                        Frequency
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
