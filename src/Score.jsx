import React, {Component} from "react";
import PropTypes from "prop-types";


class Score extends Component {
    render() {
        const score = this.props.score + "";
        const pad = "0".repeat(Math.max(0, this.props.length - score.length));

        return <div style={{display: "inline"}} className={this.props.className}>
            <span className="padding">{pad}</span><span>{score}</span>
        </div>;
    }
}

Score.propTypes = {
    score: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    className: PropTypes.string,
};

Score.defaultProps = {
    className: "",
};

export default Score;