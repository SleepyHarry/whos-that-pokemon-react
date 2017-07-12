import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import WtpTitle from "./WtpTitle";
import Carousel from "./Carousel";


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
    }rsl

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
                    <Button
                        key={gen}
                        active={gen === this.state.chosenGen}
                        onClick={this.onSelect.bind(this, gen)}
                    >
                        {gen}
                    </Button>
                )}
            </div>
            <br/>
            <div className="centre-content">
                <Button
                    onClick={this.onClick.bind(this)}
                    disabled={this.state.chosenGen === null}
                >
                    START
                </Button>
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