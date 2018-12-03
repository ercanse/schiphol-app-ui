import React, {Component} from 'react';
import Chart from './chart';
import CirclePack from './circlePack';

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {active: "CIRCLEPACK"};
    }

    handleClick() {
        var active = this.state.active;
        var newActive = active === 'CHART' ? 'CIRCLEPACK' : 'CHART';
        this.setState({
            active: newActive
        });
    }

    render() {
        var active = this.state.active;
        return (
            <div>
                <button type="button" onClick={this.handleClick.bind(this)}>
                    Toggle
                </button>
                {active === 'CHART' ? (
                    <Chart/>
                ) : active === 'CIRCLEPACK' ? (
                    <CirclePack/>
                ) : null}
            </div>
        );
    }
}

export default Container;
