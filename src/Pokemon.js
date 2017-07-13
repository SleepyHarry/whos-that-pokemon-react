import React, {Component} from 'react';
import PropTypes from 'prop-types';

import names from "./names.json";

const SPRITE_HEIGHT = 96,
    GREY = "rgb(64, 64, 64)",
    TRANSPARENT = "rgba(0, 0, 0, 0)";

function rgbToHex({r, g, b}) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length === 1) r = '0' + r;
    if (g.length === 1) g = '0' + g;
    if (b.length === 1) b = '0' + b;

    return '#' + r + b + g;
}

function pad(num) {
    let s = num + '';
    return '000'.substring(0, 3 - s.length) + s;
}

const getEvolvesFrom = (poke) => {
    // given a poke object (as in names.json), find what it evolves from (unique)
    // returns a (possibly empty) array of pokés
    return names.filter(x => x.number === poke.evolves_from_id);
};

const getEvolvesInto = (poke) => {
    // given a poke object (as in names.json), find what it evolves into
    // returns a (possibly empty) array of pokés
    return names.filter(x => x.evolves_from_id === poke.number);
};

const getFamily = (poke) => {
    // given a poke object (as in names.json), return the full evo family
    // returns an augmented poke object. object is normal but has a "evolves_from"
    // and "evolves_into" attribute, which are arrays of augmented poke objects
    // "root" poké is first in evo line
    // this object is effectively a "tree", and is referred to as a family
    let root = poke;
    while (root.evolves_from_id !== null) {
        root = getEvolvesFrom(root)[0];
    }

    let todo = [root];
    let next;
    while ((next = todo.shift()) !== undefined) {
        next.evolves_into = getEvolvesInto(next);
        todo = todo.concat(next.evolves_into);
    }

    return root;
};

export {getEvolvesFrom, getEvolvesInto, getFamily};


export default class Pokemon extends Component {
    static propTypes = {
        generation: PropTypes.number.isRequired,
        number: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,

        hidden: PropTypes.bool,
        reveal: PropTypes.instanceOf(Set),
        zoom: PropTypes.number,

        onClick: PropTypes.func,
    };

    static defaultProps = {
        hidden: false,
        reveal: new Set(),
        zoom: 1,

        onClick: (() => {}),
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.number !== nextProps.number ||
            this.props.hidden !== nextProps.hidden ||
            this.props.zoom !== nextProps.zoom
        );
    }

    drawPoke() {
        let _this = this;

        const canvas = this.refs.canvas,
            context = canvas.getContext('2d');

        let pokeImg = new window.Image();
        pokeImg.src = `/sprites/${pad(this.props.number)}.png`;

        pokeImg.onload = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(
                this,
                0, 0, SPRITE_HEIGHT, SPRITE_HEIGHT,
                0, 0, SPRITE_HEIGHT, SPRITE_HEIGHT,
            );

            let imgData = context.getImageData(0, 0, canvas.width, canvas.height).data;

            let spriteData = [];
            for (let i = 0; i < SPRITE_HEIGHT; i++) {
                spriteData.push([]);
            }
            for (let x = 0; x < SPRITE_HEIGHT; x++) {
                for (let y = 0; y < SPRITE_HEIGHT; y++) {
                    let i = (y * canvas.width + x) * 4;

                    spriteData[x][y] = (
                        // imgData[i + 3] is the "alpha" component
                        imgData[i + 3] ? rgbToHex({r: imgData[i], b: imgData[i + 1], g: imgData[i + 2]}) : null
                    );
                }
            }

            context.clearRect(0, 0, canvas.width, canvas.height);

            for (let x = 0; x < SPRITE_HEIGHT; x++) {
                for (let y = 0; y < SPRITE_HEIGHT; y++) {
                    if (_this.props.hidden && !_this.props.reveal.has([x, y]+'')) {
                        // grey if hidden
                        context.fillStyle = ((spriteData[x][y] && GREY) || TRANSPARENT);
                    } else {
                        context.fillStyle = (spriteData[x][y] || TRANSPARENT);
                    }
                    let zoom = _this.props.zoom;
                    context.fillRect(x * zoom, y * zoom, zoom, zoom);
                }
            }
        };
    }

    componentDidMount() {
        this.drawPoke();
    }

    componentDidUpdate() {
        this.drawPoke();
    }

    onClick(e) {
        const rect = e.target.getBoundingClientRect(),
            x = Math.floor((e.clientX - rect.left) / this.props.zoom),
            y = Math.floor((e.clientY - rect.top) / this.props.zoom);

        this.props.onClick({x, y});
    }

    render() {
        let zoom = this.props.zoom,
            dimension = zoom * SPRITE_HEIGHT;

        return (
            <div>
                <canvas
                    width={dimension}
                    height={dimension}
                    ref="canvas"
                    onClick={this.onClick.bind(this)}
                />
            </div>
        );
    }
}