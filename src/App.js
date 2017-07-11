import React, {Component} from "react";
import {Grid} from "react-bootstrap";
import "./App.css";

import names from "./names.json";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";

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
            screen: screens.START,

            generation: 1,  // TODO
        };

        // fetch('/api/leaderboard/').then((response) => {
        //     return response.json();
        // }).then((j) => {
        //     console.log(j);
        // });
    }

    onScreenSelect(screen) {
        this.setState({screen});
    }

    render() {
        let ActiveScreen;

        let DummyScreen = (props) => <div/>;

        switch (this.state.screen) {
            case screens.START:
                ActiveScreen = StartScreen;
                break;
            case screens.GEN_CHOOSE:
                ActiveScreen = DummyScreen;
                break;
            case screens.GAME:
                ActiveScreen = GameScreen;
                break;
            default:
                ActiveScreen = DummyScreen;
                break;
        }

        return (
            <Grid>
                <ActiveScreen
                    goToScreen={this.onScreenSelect.bind(this)}
                    screens={screens}

                    pokes={names.filter(poke => poke.generation === this.state.generation)}
                />
            </Grid>
        );
    }
}

export default App;
