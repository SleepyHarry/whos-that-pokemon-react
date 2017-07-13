import React, {Component} from "react";
import PropTypes from "prop-types";


class InitialsInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }

    onChange(e) {
        e.target.value = e.target.value.slice(0, 3).toUpperCase();

        this.setState({
            value: e.target.value,
        });
    }

    onKeyUp(e) {
        if (e.key === "Enter") {
            this.props.submit(this.state.value);
        }
    }

    render() {
        return <input
            {...this.props}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            onKeyUp={this.onKeyUp.bind(this)}
        />
    }
}

InitialsInput.propTypes = {};

export default InitialsInput;