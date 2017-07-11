import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import WtpTitle from "./WtpTitle";


class GenSelectScreen extends Component {
    constructor(props) {
        super(props);

        this.generations = new Array(...new Set(props.pokes.map(poke => poke.generation))).sort();

        this.state = {
            chosenGen: null,
        };
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
            {/*<Carousel generation={this.props.generation}/>*/}
            {this.generations.map((gen) =>
                <Button
                    key={gen}
                    active={gen === this.state.chosenGen}
                    onClick={this.onSelect.bind(this, gen)}
                >
                    {gen}
                </Button>
            )}
            <br/>
            <Button
                onClick={this.onClick.bind(this)}
                disabled={this.state.chosenGen === null}
            >
                START
            </Button>
        </div>
    }
}

GenSelectScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,

    pokes: PropTypes.array.isRequired,
};

export default GenSelectScreen;