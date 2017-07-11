import React, {Component} from "react";
import PropTypes from "prop-types";
import colours from "./colours";


class ClockBar extends Component {
    render() {
        const pct = (100 * this.props.timeRemaining / this.props.maxTime);
        let background = colours.green;
        if (this.props.timeRemaining < 16000) background = colours.amber;
        if (this.props.timeRemaining < 6000) background = colours.red;

        return <div
            style={{
                border: "solid 2px black",
                width: "100%",
                height: "10px",
                background: "rgba(0, 0, 0, 0)",
            }}
        >
            <div
                style={{
                    width: pct + "%",
                    height: "100%",
                    background,
                }}
            />
        </div>;
    }
}

ClockBar.propTypes = {
    timeRemaining: PropTypes.number.isRequired,
    maxTime: PropTypes.number.isRequired,
};

export default ClockBar;