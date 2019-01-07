import React, {Component} from 'react';
import Chart from './chart';
import CirclePack from './circlePack';
import PubSub from 'pubsub-js';
import moment from 'moment';

const CHART = 'CHART';
const CIRCLEPACK = 'CIRCLEPACK';

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {active: CIRCLEPACK, toggleToken: null, dateToken: null, date: moment().subtract(1, 'days')};
    }

    componentDidMount() {
        var self = this;

        var toggleListener = function (msg, data) {
            self.setState({active: data});
        };
        var toggleToken = PubSub.subscribe('toggleTopic', toggleListener);
        self.setState({toggleToken: toggleToken});

        var dateListener = function (msg, data) {
            var date = moment(data);
            self.setState({date: date});
        };
        var dateToken = PubSub.subscribe('dateTopic', dateListener);
        self.setState({dateToken: dateToken});
    }

    render() {
        var self = this;
        var active = this.state.active;
        return (
            <div>
                {active === CHART ? (
                    <Chart date={self.state.date} />
                ) : active === CIRCLEPACK ? (
                    <CirclePack date={self.state.date} />
                ) : null}
            </div>
        );
    }
}

export default Container;
