import React, {Component} from "react";
import PropTypes from "prop-types";
import WtpTitle from "./WtpTitle";
import Carousel from "./Carousel";
import ArcadeButton from "./ArcadeButton";


class GenSelectScreen extends Component {
    constructor(props) {
        super(props);

        this.generations = new Array(...new Set(props.pokes.map(poke => poke.generation))).sort();

        this.state = {
            chosenGen: 1,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lastScore) {
            this.setState({
                chosenGen: nextProps.lastScore.generation,
            });
        }
    }

    onSelect(gen) {
        this.setState({chosenGen: gen});
    }

    onClick() {
        this.props.goToScreen(
            this.props.screens.GAME,
            {
                generation: this.state.chosenGen,
            },
        );
    }

    render() {
        return <div>
            <WtpTitle/>
            <div className="centre-content">
                <Carousel pokes={this.props.pokes.filter(poke => poke.generation === this.state.chosenGen)}/>
            </div>

            <div className="centre-content">
                {this.generations.map((gen) =>
                    <ArcadeButton
                        key={gen}
                        className="gen-choice-button"
                        active={gen === this.state.chosenGen}
                        onClick={this.onSelect.bind(this, gen)}
                    >
                        {gen}
                    </ArcadeButton>
                )}
            </div>
            <br/>
            <div className="centre-content">
                <ArcadeButton
                    className="start-button"
                    onClick={this.onClick.bind(this)}
                    disabled={this.state.chosenGen === null}
                >
                    START
                </ArcadeButton>
            </div>
        </div>
    }
}

GenSelectScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,

    pokes: PropTypes.array.isRequired,
};

export default GenSelectScreen;