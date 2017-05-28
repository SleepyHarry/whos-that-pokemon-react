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
            hidden: false,

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
            alert('correct!');
            this.setState({
                pokemon: this.randPoke(),
                currentGuess: '',
            });
        } else {
            alert('nope!');
        }
    }

    render() {
        return (
            <div>
                <Col xs={6}>
                    <Button onClick={this.newPoke.bind(this)}>
                        Shuffle
                    </Button>
                    <Button onClick={this.toggleHidden.bind(this)}>
                        {this.state.hidden ? 'Reveal' : 'Hide'}
                    </Button>
                </Col>
                <Col xs={4}>
                    <FormGroup validationState={null}>
                        <FormControl
                            type="text"
                            placeholder="Your guess"
                            onChange={this.onChange.bind(this)}
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
