import React, {Component} from "react";
import {Button, Col, FormControl, FormGroup} from "react-bootstrap";
import "./App.css";

import names from "./names.json";
import Pokemon from "./Pokemon";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pokemon: this.randPoke(),
            hidden: true,

            currentGuess: '',
        };
    }

    toggleHidden() {
        this.setState(prevState => ({
            hidden: !prevState.hidden,
        }));
    }

    newPoke() {
        this.setState({
            pokemon: this.randPoke(),
        });
    }

    randPoke() {
        // TODO: Generation filtering
        return names[Math.floor(Math.random() * 151)];
    }

    onChange(e) {
        this.setState({
            currentGuess: e.target.value,
        });
    }

    onSubmit() {
        if (this.state.currentGuess.toLowerCase() === this.state.pokemon.name) {
            this.setState({
                hidden: false,
            });

            setTimeout(
                () => {
                    this.setState({
                        hidden: true,
                        currentGuess: '',
                        pokemon: this.randPoke(),
                    });
                    this.guessInput.focus();
                },
                2000,
            );
        } else {
            // TODO
        }
    }

    onKeyUp(e) {
        if (e.key === "Enter") {
            this.onSubmit();
        }
    }

    render() {
        return (
            <div>
                <Col xs={6}>
                    <Button onClick={this.newPoke.bind(this)}>
                        Shuffle
                    </Button>
                </Col>
                <Col xs={4}>
                    <FormGroup validationState={null}>
                        <FormControl
                            type="text"
                            value={this.state.currentGuess}
                            placeholder="Your guess"
                            inputRef={(input) => { this.guessInput = input; }}
                            onChange={this.onChange.bind(this)}
                            onKeyUp={this.onKeyUp.bind(this)}
                            disabled={!this.state.hidden}
                        />
                    </FormGroup>
                </Col>
                <Col xs={2}>
                    <Button
                        type="submit"
                        onClick={this.onSubmit.bind(this)}
                    >
                        Guess
                    </Button>
                </Col>
                <Pokemon
                    {...this.state.pokemon}
                    hidden={this.state.hidden}
                    zoom={6}
                />
            </div>
        );
    }
}

export default App;
