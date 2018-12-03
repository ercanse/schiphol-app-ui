import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';
import * as d3 from "d3";

import './circlePack.css';

var createReactClass = require('create-react-class');

var ReactD3Pack = createReactClass({
    propTypes: {
        data: PropTypes.object
    },

    componentDidMount: function () {
        this.initD3();
    },

    componentWillReceiveProps: function (nextProps) {
        this.loadData(nextProps);
    },

    render: function () {
        return <span></span>;
    },

    componentWillUnmount: function () {
        clearInterval(this.resizeTimer);
    },

    initD3: function () {
        this.vis = d3.select(ReactDOM.findDOMNode(this))
            .insert("svg:svg").append("svg:g");

        this.circlesGroup = this.vis.append("g");
        this.textsGroup = this.vis.append("g");

        this.pack = d3.pack().size(function (d) {
            return d.data.size;
        }).radius(function (d) {
            return d.data.size / 10;
        });

        this.update();

        // this.load(this.props);
        this.loadData(this.props);

        d3.select(window).on("click", function () {
            this.zoom(this.data);
        }.bind(this));

        var ns = Math.random();
        d3.select(window).on('resize.' + ns, this.resizeHandler);
    },

    update: function () {
        // Set Width, Height and Radius (get size from parent div)
        var parentNode = d3.select(ReactDOM.findDOMNode(this).parentElement);
        console.log(parentNode);
        var parentWidth = parentNode._groups[0][0].offsetWidth;
        // this.w = this.h = this.r = 1200;
        this.w = this.h = this.r = parentWidth;

        this.x = scaleLinear().range([0, this.r]);
        this.y = scaleLinear().range([0, this.r]);

        this.r = (this.w < this.h) ? this.w : this.h;

        this.x = scaleLinear().range([0, this.r]);
        this.y = scaleLinear().range([0, this.r]);

        // Set SVG element's size and position
        d3.select(ReactDOM.findDOMNode(this)).select('svg')
            .attr("width", this.w)
            .attr("height", this.h)
            .select('g')
            .attr("transform", "translate(" + (this.w - this.r) / 2 +
                "," + (this.h - this.r) / 2 + ")");

        // Run Pack Layout and update its size
        this.pack.size([this.r, this.r]);
        if (this.data) {
            this.nodes = this.pack(this.data);
        }
    },

    loadData: function (props) {
        this.data = props.data;
        this.data = d3.hierarchy(this.data)
            .sum(function (d) {
                return d.size;
            }).sort(function (a, b) {
                return b.value - a.value;
            });

        this.nodes = this.pack(this.data);
        this.draw();
    },

    draw: function () {
        var startDelay = 0,
            elementDelay = 50;

        var circles = this.circlesGroup.selectAll("circle")
            .data(this.nodes.descendants());
        var color = d3.scaleSequential(d3.interpolateMagma).domain([2, 0]);

        circles.enter().append("svg:circle")
            .attr("class", function (d) {
                return d.children ? "parent" : "child";
            })
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", function (d) {
                return d.r;
            })
            .attr("fill", function (d) {
                return color(d.height);
            })
            .on("click", function (d) {
                return this.zoom(this.data === d ? this.data : d);
            }.bind(this))
            .transition().duration(400);

        circles.transition().duration(400)
            .delay(function (d, i) {
                return startDelay + (i * elementDelay);
            })
            .attr("class", function (d) {
                return d.children ? "parent" : "child";
            })
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", function (d) {
                return d.r;
            });

        circles.exit().transition().duration(200)
            .attr("r", 0)
            .style("opacity", 0)
            .remove();

        var texts = this.textsGroup
            .selectAll("text")
            .data(this.nodes.descendants());

        texts.enter().append("svg:text")
            .style("opacity", 0)
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .transition().duration(400);

        texts.transition().duration(400)
            .attr("class", function (d) {
                return d.children ? "parent" : "child";
            })
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .delay(function (d, i) {
                return startDelay + (i * elementDelay);
            })
            .style("opacity", function (d) {
                return d.r > 20 ? 1 : 0;
            })
            .text(function (d) {
                return d.data.name;
            });

        texts.exit().transition().duration(200)
            .style("opacity", 0)
            .remove();
    },

    zoom: function (d, i) {
        var k = this.r / d.r / 2;
        this.x.domain([d.x - d.r, d.x + d.r]);
        this.y.domain([d.y - d.r, d.y + d.r]);

        var t = this.vis.transition()
            .duration(d3.event.altKey ? 7500 : 750);

        t.selectAll("circle")
            .attr("cx", function (d) {
                return this.x(d.x);
            }.bind(this))
            .attr("cy", function (d) {
                return this.y(d.y);
            }.bind(this))
            .attr("r", function (d) {
                return k * d.r;
            });

        t.selectAll("text")
            .attr("x", function (d) {
                return this.x(d.x);
            }.bind(this))
            .attr("y", function (d) {
                return this.y(d.y);
            }.bind(this))
            .text(function (d) {
                return d.data.name;
            })
            .style("opacity", function (d) {
                return k * d.r > 20 ? 1 : 0;
            });

        d3.event.stopPropagation();
    },

    resizeHandler: function () {
        clearInterval(this.resizeTimer);
        this.resizeTimer = setTimeout(function () {
            this.update();
            this.draw(this.props);
        }.bind(this), 200);
    }
});

export default ReactD3Pack;
