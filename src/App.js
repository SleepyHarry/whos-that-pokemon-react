import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import './App.css';

import names from './names.json';
import Pokemon from "./Pokemon";

class App extends Component {
    randPoke() {
        // TODO: Generation filtering
        return names[Math.floor(Math.random() * 151)];
    }

    constructor(props) {
        super(props);

        this.state = {
            pokemon: this.randPoke(),
            hidden: false,
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

    render() {
        return (
            <div>
                <Button onClick={this.newPoke.bind(this)}>
                    shuffle
                </Button>
                <Button onClick={this.toggleHidden.bind(this)}>
                    {this.state.hidden ? 'reveal' : 'hide'}
                </Button>
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
