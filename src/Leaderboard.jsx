import React, {Component} from "react";
import PropTypes from "prop-types";
import LeaderboardEntry from "./LeaderboardEntry";
import ArcadeButton from "./ArcadeButton";


class Leaderboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            generations: [],
            generation: 1,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lastScore) {
            this.setState({
                generation: nextProps.lastScore.generation,
            });
        }
    }

    componentDidMount() {
        this.setState({
            generations: new Array(...new Set(this.props.leaderboard.map(score => score.generation))).sort(),
        });

        this.timerID = setInterval(() => {
            this.setState((prevState) => ({
                generation: (prevState.generation % this.state.generations.length) + 1,  // mod first because 1-indexed gens
            }));
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    onSelectGen(generation) {
        this.setState({generation});
    }

    render() {
        const leaderboard = this.props.leaderboard
                .filter(entry => entry.generation === this.state.generation);

        const lastScoreInTop10 = this.props.lastScore && leaderboard.map(
            entry => entry.id
        ).indexOf(this.props.lastScore.id) !== -1;

        return <div style={{marginTop: "70px"}}>
            <div className="centre-content">
                <h5>GENERATION</h5>
            </div>
            <div className="spaced-content">
                {this.state.generations.map(gen =>
                    <ArcadeButton
                        key={gen}
                        className="leaderboard-gen-button"
                        active={gen === this.state.generation}
                        onClick={this.onSelectGen.bind(this, gen)}
                    >
                        {gen}
                    </ArcadeButton>
                )}
            </div>
            <div
                style={{
                    width: "100%",
                    height: "1px",
                    color: "black",
                    background: "#9b9b9b",
                    margin: "0 auto",
                }}
            />
            <br/>
            {leaderboard.map((entry, i) =>
                <LeaderboardEntry
                    key={entry.id}
                    rank={i + 1}
                    distinguish={entry.id === (this.props.lastScore && this.props.lastScore.id)}
                >
                    {entry}
                </LeaderboardEntry>
            )}
            <br/>
            {this.props.lastScore && this.props.lastScore.generation === this.state.generation && !lastScoreInTop10 &&
                <LeaderboardEntry
                    distinguish={true}
                    rank={this.props.lastScore.rank}
                >
                    {this.props.lastScore}
                </LeaderboardEntry>
            }
        </div>
    }
}

Leaderboard.propTypes = {
    lastScore: PropTypes.shape({
        id: PropTypes.number,
        initials: PropTypes.string,
        points: PropTypes.number,
        generation: PropTypes.number,
    }),
    leaderboard: PropTypes.array.isRequired,
};

Leaderboard.defaultProps = {
    lastScore: null,
};

export default Leaderboard;