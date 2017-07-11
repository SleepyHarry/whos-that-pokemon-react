import React, {Component} from "react";
import {Grid} from "react-bootstrap";
import "./App.css";

import names from "./names.json";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import GenSelectScreen from "./GenSelectScreen";

const screens = {
    START: Symbol("start screen"),
    GAME: Symbol("game screen"),
    GEN_CHOOSE: Symbol("generation choose screen"),
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            screen: screens.START,

            generation: null,

            lastScore: null,
        };

        // fetch('/api/leaderboard/').then((response) => {
        //     return response.json();
        // }).then((j) => {
        //     console.log(j);
        // });
    }

    onScreenSelect(screen, state) {
        this.setState({
            screen,
            ...state,  // to pass extra info, like generation choice
        });
    }

    onScoreSubmit(score) {
        // score = {initials, points}
        this.setState({
            lastScore: {
                ...score,
                generation: this.state.generation,
            },
        });
    }

    render() {
        let ActiveScreen;

        let DummyScreen = (props) => <div/>;

        switch (this.state.screen) {
            case screens.START:
                ActiveScreen = StartScreen;
                break;
            case screens.GEN_CHOOSE:
                ActiveScreen = GenSelectScreen;
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

                    pokes={this.state.generation === null ?
                        names :
                        names.filter(poke => poke.generation === this.state.generation)
                    }
                    lastScore={this.state.lastScore}
                    submitScore={this.onScoreSubmit.bind(this)}
                />
            </Grid>
        );
    }
}

export default App;
