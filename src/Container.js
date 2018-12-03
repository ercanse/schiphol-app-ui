import React, {Component} from 'react';
import Chart from './chart';
import CirclePack from './circlePack';
import PubSub from 'pubsub-js';

const CHART = 'CHART';
const CIRCLEPACK = 'CIRCLEPACK';

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {active: CIRCLEPACK, token: null};
    }

    componentDidMount() {
        var self = this;
        var toggleListener = function (msg, data) {
            self.setState({active: data});
        };
        var token = PubSub.subscribe('toggleTopic', toggleListener);
        self.setState({token: token});
    }

    render() {
        var active = this.state.active;
        return (
            <div>
                {active === CHART ? (
                    <Chart/>
                ) : active === CIRCLEPACK ? (
                    <CirclePack/>
                ) : null}
            </div>
        );
    }
}

export default Container;
