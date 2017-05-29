import React, {Component} from "react";
import {Button, Col, FormControl, FormGroup} from "react-bootstrap";
import "./App.css";

import names from "./names.json";
import Pokemon from "./Pokemon";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,

            potentials: names.filter(poke => poke.generation === 1),
            // pokemon: this.randPoke(),
            hidden: true,

            currentGuess: '',
            points: 0,
        };

        this.randPoke = this.randPoke.bind(this);
    }

    componentDidMount() {
        this.setState({
            pokemon: this.randPoke(),
            loading: false,
        });
    }

    newPoke() {
        this.setState((prevState) => ({
            points: prevState.points - 1,
            pokemon: this.randPoke(),
        }));
    }

    randPoke() {
        // TODO: Generation filtering
        // TODO: What if empty
        const n = this.state.potentials.length,
            i = Math.floor(Math.random() * n),
            newPoke = this.state.potentials[i];

        this.setState({
            potentials: [
                ...this.state.potentials.slice(0, i),
                ...this.state.potentials.slice(i + 1, n),
            ],
        });
        return newPoke;
    }

    onChange(e) {
        this.setState({
            currentGuess: e.target.value,
        });
    }

    onSubmit() {
        if (this.state.currentGuess.toLowerCase() === this.state.pokemon.name) {
            this.setState((prevState) => ({
                points: prevState.points + 1,
                hidden: false,
            }));

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
                <Col xs={3}>
                    <Button onClick={this.newPoke.bind(this)}>
                        Shuffle (cost: 1 point)
                    </Button>
                </Col>
                <Col xs={3}>
                    <h2>{this.state.points} points!</h2>
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
                {this.state.loading ? null :
                <Pokemon
                    {...this.state.pokemon}
                    hidden={this.state.hidden}
                    zoom={6}
                />}
            </div>
        );
    }
}

export default App;
