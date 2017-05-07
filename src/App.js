import React, {Component} from 'react';
import './App.css';

import names from './names.json';
import Pokemon from "./Pokemon";

const biscuit = names[57];

class App extends Component {
    render() {
        return (
            <div>
                <Pokemon
                    {...biscuit}
                />
            </div>
        );
    }
}

export default App;
