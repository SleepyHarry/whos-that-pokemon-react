import React, {Component} from "react";
import PropTypes from "prop-types";
import WtpTitle from "./WtpTitle";
import ArcadeButton from "./ArcadeButton";


class InstructionsScreen extends Component {
    render() {
        const numGens = new Array(...new Set(this.props.pokes.map(poke => poke.generation))).length;

        return <div>
            <WtpTitle/>
            <div className="instructions">
                <p>In this game, you have 60 seconds to guess the names of as many Pokémon as you can, going only by their sillhouettes.</p>
                <p>A correct guess will earn you points based on how quickly you answer, but there are also points for accuracy! If you are almost correct (for example guessing "Pikchu" instead of "Pikachu"), you will only earn half of what you would have got with a correctly spelled answer.</p>
                <p>Wrong answers do not penalise you, but you won't get any points. You can skip a Pokémon you don't know by simply hitting enter or pressing "Guess" at any time.</p>
                <p>When the 60 seconds are up, you'll get a score and be asked to give your initials for the leaderboard.</p>
                <p>Each generation has its own leaderboard. Can you get into the top ten on all {numGens}?</p>
            </div>
            <div className="instructions-button-group">
                <ArcadeButton
                    onClick={() => {this.props.goToScreen(this.props.screens.START)}}
                >
                    &lt; BACK
                </ArcadeButton>
                <ArcadeButton
                    onClick={() => {this.props.goToScreen(this.props.screens.GEN_CHOOSE)}}
                >
                    START &gt;
                </ArcadeButton>
            </div>
        </div>
    }
}

InstructionsScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,
};

export default InstructionsScreen;