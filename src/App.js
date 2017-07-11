import React, {Component} from "react";
import {Button, Col, FormControl, FormGroup, Grid, Row} from "react-bootstrap";
import "./App.css";

import names from "./names.json";
import Pokemon from "./Pokemon";
import StatusBox from "./StatusBox";
import levenshtein from "./levenshtein";

const points = {
    CORRECT: 10,
    WRONG: -0,
    CLOSE: -0,
    SKIP: -5,
    REVEAL: -2,
    GEN_CLUE: -2,
    EVO_CLUE: -4,

    START: 5,
};

const screens = {
    START: Symbol("start screen"),
    GAME: Symbol("game screen"),
    GEN_CHOOSE: Symbol("generation choose screen"),
};

class App extends Component {
    constructor(props) {
        super(props);

        this.allGenerations = new Array(...new Set(names.map(poke => poke.generation))).sort();

        this.state = {
            loading: true,

            screen: screens.START,

            potentials: names.filter(poke => poke.generation === 1),
            generation: 1,  // TODO
            // pokemon: this.randPoke(),
            hidden: true,

            currentGuess: '',
            points: points.START,
            status: null,
        };

        this.randPoke = this.randPoke.bind(this);

        fetch('/api/leaderboard/').then((response) => {
            return response.json();
        }).then((j) => {
            console.log(j);
        });
    }

    componentDidMount() {
        this.setState({
            pokemon: this.randPoke(),
            loading: false,
        });
    }

    randPokeFromPotentials(potentials) {
        const n = potentials.length,
            i = Math.floor(Math.random() * n),
            newPoke = potentials[i];

        potentials = [
            ...potentials.slice(0, i),
            ...potentials.slice(i + 1, n),
        ];

        return {
            newPoke,
            potentials,
        };
    }

    randPoke() {
        // TODO: What if empty
        let {newPoke, potentials} = this.randPokeFromPotentials(this.state.potentials);

        this.setState({potentials});
        return newPoke;
    }

    onChange(e) {
        this.setState({
            currentGuess: e.target.value,
            status: null,
        });
    }

    clean(s) {
        return s.toLowerCase().replace(/[^a-z]/g, '');
    }

    onSubmit() {
        const guess = this.clean(this.state.currentGuess);
        const target = this.clean(this.state.pokemon.name);

        if (guess === target) {
            this.setState((prevState) => ({
                points: prevState.points + points.CORRECT,
                hidden: false,
                reveal: new Set(),
                status: "correct",
            }));

            setTimeout(
                () => {
                    this.setState({
                        hidden: true,
                        currentGuess: '',
                        pokemon: this.randPoke(),
                        status: null,
                    });
                    this.guessInput.focus();
                },
                2000,
            );
        } else if (levenshtein(guess, target) <= 2) {
            this.setState((prevState) => ({
                status: "close",
                points: prevState.points + points.CLOSE,
            }));
        } else {
            this.setState((prevState) => ({
                status: "nope",
                points: prevState.points + points.WRONG,
            }));
        }
    }

    onKeyUp(e) {
        if (e.key === "Enter") {
            this.onSubmit();
        }
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={3}>
                        <h2>{this.state.points} point{this.state.points === 1 ? "": "s"}!</h2>
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
                </Row>
                <Row>
                    <Col xs={8}>
                        {this.state.loading ? null :
                        <Pokemon
                            {...this.state.pokemon}
                            hidden={this.state.hidden}
                            zoom={6}
                        />}
                    </Col>
                    <Col xs={2}>
                        {this.state.status ?
                        <StatusBox option={this.state.status}/> :
                        null}
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default App;
