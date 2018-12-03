import React, {Component} from 'react';
import Chart from './chart';
import CirclePack from './circlePack';

const CHART = 'CHART';
const CIRCLEPACK = 'CIRCLEPACK';

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {active: CIRCLEPACK};
    }

    handleClick() {
        var active = this.state.active;
        var newActive = active === CHART ? CIRCLEPACK : CHART;
        this.setState({
            active: newActive
        });
    }

    render() {
        var active = this.state.active;
        var buttonText = active === CHART ? 'Switch to circle pack' : 'Switch to bar chart';
        return (
            <div>
                <button type="button" onClick={this.handleClick.bind(this)}>
                    {buttonText}
                </button>
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
