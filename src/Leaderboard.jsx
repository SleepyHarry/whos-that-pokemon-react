import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";


class Leaderboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            generations: [],
            generation: 1,  // TODO: Based on previous pick
        };
    }

    componentDidMount() {
        this.setState({
            generations: new Array(...new Set(this.props.leaderboard.map(score => score.generation))).sort(),
        });
    }

    onSelectGen(generation) {
        this.setState({generation});
    }

    render() {
        return <div>
            <div>
                {this.state.generations.map(gen =>
                    <Button
                        key={gen}
                        onClick={this.onSelectGen.bind(this, gen)}
                    >
                        {gen}
                    </Button>
                )}
            </div>
            {this.props.leaderboard
                .filter(entry => entry.generation === this.state.generation)
                .map(entry =>
                    <div>{entry.initials} - {entry.generation} - {entry.score}</div>
                )
            }
        </div>
    }
}

Leaderboard.propTypes = {
    leaderboard: PropTypes.array.isRequired,
};

export default Leaderboard;