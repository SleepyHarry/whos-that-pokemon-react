import React, {Component} from "react";
import PropTypes from "prop-types";
import {Col, FormControl, FormGroup} from "react-bootstrap";
import ArcadeButton from "./ArcadeButton";


class GuessInput extends Component {
    componentDidMount() {
        this.guessInput.focus();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.disabled && !this.props.disabled) {
            // time for a new guess
            this.guessInput.focus();
        }
    }

    render() {
        return <div>
            <Col xs={4} xsOffset={1}>
                <FormGroup>
                    <FormControl
                        key="guess-input"
                        className="guess-input"
                        type="text"
                        value={this.props.currentGuess}
                        placeholder="Start typing!"
                        inputRef={(input) => {
                            this.guessInput = input;
                        }}
                        onChange={this.props.onChange}
                        onKeyUp={this.props.onKeyUp}
                        disabled={this.props.disabled}
                    />
                </FormGroup>
            </Col>
            <Col xs={2}>
                <ArcadeButton
                    type="submit"
                    onClick={this.props.onSubmit}
                >
                    Guess
                </ArcadeButton>
            </Col>
        </div>;
    }
}

GuessInput.propTypes = {
    currentGuess: PropTypes.string.isRequired,
    disabled: PropTypes.bool,

    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

GuessInput.defaultProps = {
    disabled: false,
};

export default GuessInput;