import React, {Component} from 'react';
import PubSub from 'pubsub-js';

const CHART = 'CHART';
const CIRCLEPACK = 'CIRCLEPACK';

class ToggleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: CIRCLEPACK
        };
    }

    handleClick() {
        var active = this.state.active;
        var newActive = active === CHART ? CIRCLEPACK : CHART;
        this.setState({
            active: newActive
        });
        PubSub.publish('toggleTopic', newActive);
    }

    render() {
        var buttonText = this.state.active === CHART ? 'Switch to circle pack' : 'Switch to bar chart';
        return (
            <div>
                <button type="button" onClick={this.handleClick.bind(this)}>
                    {buttonText}
                </button>
            </div>
        );
    }
}

export default ToggleButton;
