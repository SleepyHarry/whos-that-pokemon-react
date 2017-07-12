import React, {Component} from "react";
import PropTypes from "prop-types";
import {shuffle} from "./util";
import Pokemon from "./Pokemon";


const perLine = 10;

class Carousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            pokes: this.shufflePokes(props.pokes),
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            pokes: this.shufflePokes(nextProps.pokes),
        });
    }

    componentDidMount() {
        this.tickTimerID = setInterval(
            () => {
                this.setState((prevState) => ({
                    offset: (prevState.offset + perLine) % this.props.pokes.length,
                }));
            },
            5000,
        );
    }

    componentWillUnmount() {
        clearInterval(this.tickTimerID);
    }

    shufflePokes(pokes) {
        const shuffled = shuffle(pokes);
        return [  // overlap slightly to allow us to "loop" seamlessly
            ...shuffled,
            ...shuffled.slice(0, perLine),
        ]
    }

    render() {
        return <div style={{display: "flex"}}>
            {this.state.pokes.slice(this.state.offset, this.state.offset + perLine).map(poke =>
                <Pokemon
                    key={poke.number}
                    {...poke}
                />
            )}
        </div>
    }
}

Carousel.propTypes = {
    pokes: PropTypes.array.isRequired,
};

export default Carousel;