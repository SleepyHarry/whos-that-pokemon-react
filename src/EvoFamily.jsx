import React, {Component} from "react";
import PropTypes from "prop-types";
import Pokemon, {getFamily} from "./Pokemon";


export default class EvoFamily extends Component {
    static propTypes = {
        // if family is not provided, seed must be
        seed: PropTypes.object,
        family: PropTypes.object,
    };

    static defaultTypes = {
        seed: undefined,
        family: undefined,
    };

    render() {
        let family = this.props.family;
        if (family === undefined) {
            family = getFamily(this.props.seed);
        }

        let curPoke = family;
        let pokes = [curPoke];

        while (curPoke.evolves_into.length > 0) {
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
                    hidden={poke.number === this.props.seed.number}
                />
            )}
        </div>
    }
}