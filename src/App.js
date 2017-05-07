import React, {Component} from 'react';
import './App.css';

import names from './names.json';
import Pokemon from "./Pokemon";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pokemon: names[Math.floor(Math.random() * 151)],
            hidden: false,
        };
    }

    toggleHidden() {
        this.setState(prevState => ({
            hidden: !prevState.hidden,
        }));
    }

    newPoke() {
        // TODO: Generation filtering
        this.setState({
            pokemon: names[Math.floor(Math.random() * 151)],
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.newPoke.bind(this)}>
                    shuffle
                </button>
                <button onClick={this.toggleHidden.bind(this)}>
                    {this.state.hidden ? 'reveal' : 'hide'}
                </button>
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
