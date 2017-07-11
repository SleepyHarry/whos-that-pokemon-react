import React, {Component} from "react";
import {Grid} from "react-bootstrap";
import "./App.css";

import names from "./names.json";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import GenSelectScreen from "./GenSelectScreen";

const screens = {
    LOADING: Symbol("loading screen"),
    START: Symbol("start screen"),
    GAME: Symbol("game screen"),
    GEN_CHOOSE: Symbol("generation choose screen"),
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,

            screen: screens.LOADING,

            generation: null,

            leaderboard: [],
            lastScore: null,
        };
    }

    componentDidMount() {
        fetch('/api/leaderboard/')
            .then(response => response.json())
            .then((j) => {
                this.setState({
                    loading: false,
                    screen: screens.START,
                    leaderboard: j,
                });
            });
    }

    onScreenSelect(screen, state) {
        this.setState({
            screen,
            ...state,  // to pass extra info, like generation choice
        });
    }

    onScoreSubmit(score) {
        // score = {initials, points}
        const newScore = {
            ...score,
            generation: this.state.generation,
        };

        this.setState({
            lastScore: newScore,
        });

        fetch(
            '/api/leaderboard/',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newScore),
            },
        )
            .then(response => response.json())
            .then(j => { console.log(j); })
            .catch(response => { console.log(response); });
    }

    render() {
        let ActiveScreen;

        switch (this.state.screen) {
            case screens.LOADING:
                ActiveScreen = (props) => <h1>Loading!</h1>;
                break;
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
                ActiveScreen = (props) => <h1>Something has gone horribly wrong!</h1>;
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
                    leaderboard={this.state.leaderboard}
                />
            </Grid>
        );
    }
}

export default App;
