import React, {Component} from "react";
import PropTypes from "prop-types";


class Leaderboard extends Component {
    render() {
        return <div>
            {this.props.leaderboard.map(entry =>
                <div>{entry.initials} - {entry.generation} - {entry.score}</div>
            )}
        </div>
    }
}

Leaderboard.propTypes = {
    leaderboard: PropTypes.array.isRequired,
};

export default Leaderboard;