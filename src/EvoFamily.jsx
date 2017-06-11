import React, {Component} from "react";
import PropTypes from "prop-types";
import Pokemon from "./Pokemon";


export default class EvoFamily extends Component {
    static propTypes = {
        family: PropTypes.object.isRequired,
    };

    render() {
        console.log(this.props.family);
        let curPoke = this.props.family;
        let pokes = [curPoke];

        console.log('curPoke:', curPoke);
        while (curPoke.evolves_into.length > 0) {
            console.log('pokes:', pokes);
            pokes.push(curPoke.evolves_into[0]);
            curPoke = curPoke.evolves_into[0];
        }

        return <div>
            {pokes.map(poke =>
                <Pokemon
                    key={poke.number}
                    generation={poke.generation}
                    number={poke.number}
                    name={poke.name}
                />
            )}
        </div>
    }
}