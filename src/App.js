import React, {Component} from "react";
import {Button, Checkbox, Col, FormControl, FormGroup, Grid, Row} from "react-bootstrap";
import "./App.css";

import names from "./names.json";
import Pokemon from "./Pokemon";
import StatusBox from "./StatusBox";

const points = {
    CORRECT: 10,
    WRONG: -0,
    SKIP: -5,
    REVEAL: -2,
    GEN_CLUE: -2,
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,

            potentials: names,//.filter(poke => poke.generation === 1),
            generations: new Set(names.map(poke => poke.generation)),
            // pokemon: this.randPoke(),
            hidden: true,
            reveal: new Set(),

            currentGuess: '',
            points: 0,
            status: null,
        };

        this.generations = new Array(...this.state.generations).sort();

        this.randPoke = this.randPoke.bind(this);
    }

    componentDidMount() {
        this.setState({
            pokemon: this.randPoke(),
            loading: false,
        });
    }

    componentWillUpdate({nextState}) {
        if (nextState.points < 0) {
            // TODO: game over
            console.log("Game over!");
        }
    }

    skipPoke() {
        if (this.state.points === 0) {
            this.setState({
                status: "forbidden",
            });
        } else {
            this.setState((prevState) => ({
                points: prevState.points + points.SKIP,
                pokemon: this.randPoke(),
            }));
        }
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

    onGenerationSelect(gen, e) {
        const checked = e.target.checked;  // to avoid persisting the event

        this.setState((prevState) => {
            let generations = prevState.generations;

            checked ? generations.add(gen) : generations.delete(gen);

            let fullPotentials = names
                .filter(poke => generations.has(poke.generation));

            let {newPoke, potentials} = this.randPokeFromPotentials(fullPotentials);

            return {
                generations,
                potentials,
                pokemon: newPoke,
                reveal: new Set(),
            };
        });
    }

    generousMatch(s1, s2) {
        s1 = s1.toLowerCase().replace(/[^a-z]/g, '');
        s2 = s2.toLowerCase().replace(/[^a-z]/g, '');

        return s1 === s2;
    }

    onSubmit() {
        if (this.generousMatch(this.state.currentGuess, this.state.pokemon.name)) {
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

    onClickToReveal({x, y}) {
        // TODO: Dynamic radius (based on difficulty? increasing? based on points spent?)

        const radius = 5;

        if (this.state.points + points.REVEAL < 0) {
            this.setState({
                status: "forbidden",
            });
        } else {
            this.setState((prevState) => {
                for (let xDiff=-radius; xDiff<=radius; xDiff++) {
                    for (let yDiff=-radius; yDiff<=radius; yDiff++) {
                        if (Math.sqrt(xDiff**2 + yDiff**2) <= radius) {
                            prevState.reveal.add([x + xDiff, y + yDiff]+'');
                        }
                    }
                }

                return {
                    reveal: prevState.reveal,  // updated inplace by above
                    points: prevState.points + points.REVEAL,
                };
            });
        }
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={3}>
                        <Button onClick={this.skipPoke.bind(this)}>
                            {`Skip (cost: ${Math.abs(points.SKIP)} points)`}
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
                            reveal={this.state.reveal}
                            onClick={this.onClickToReveal.bind(this)}
                        />}
                    </Col>
                    <Col xs={2}>
                        {this.state.status ?
                        <StatusBox option={this.state.status}/> :
                        null}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            {this.generations.map(gen =>
                            <Checkbox
                                key={gen}
                                inline
                                checked={this.state.generations.has(gen)}
                                onChange={this.onGenerationSelect.bind(this, gen)}
                            >
                                Gen {gen}
                            </Checkbox>)}
                        </FormGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default App;
