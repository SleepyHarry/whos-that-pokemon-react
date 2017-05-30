import React, {Component} from "react";
import {Button, Col, FormControl, FormGroup, Grid, Row} from "react-bootstrap";
import "./App.css";

import names from "./names.json";
import Pokemon from "./Pokemon";
import StatusBox from "./StatusBox";

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
            status: null,
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
        if (this.state.points === 0) {
            // TODO: say no
        } else {
            this.setState((prevState) => ({
                points: prevState.points - 1,
                pokemon: this.randPoke(),
            }));
        }
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
            status: null,
        });
    }

    onSubmit() {
        if (this.state.currentGuess.toLowerCase() === this.state.pokemon.name) {
            this.setState((prevState) => ({
                points: prevState.points + 1,
                hidden: false,
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
        } else {
            this.setState({
                status: "nope",
            });
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
                        <Button onClick={this.newPoke.bind(this)}>
                            Shuffle (cost: 1 point)
                        </Button>
                    </Col>
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
                    <Col xs={10}>
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
