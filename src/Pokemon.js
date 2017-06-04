import React, {Component} from 'react';
import PropTypes from 'prop-types';

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


export default class Pokemon extends Component {
    static propTypes = {
        generation: PropTypes.number.isRequired,
        number: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,

        hidden: PropTypes.bool.isRequired,
        zoom: PropTypes.number,
    };

    static defaultProps = {
        zoom: 1,
    };

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

            for (let i = 0; i < SPRITE_HEIGHT; i++) {
                for (let j = 0; j < SPRITE_HEIGHT; j++) {
                    if (_this.props.hidden) {
                        // grey if hidden
                        context.fillStyle = ((spriteData[i][j] && GREY) || TRANSPARENT);
                    } else {
                        context.fillStyle = (spriteData[i][j] || TRANSPARENT);
                    }
                    let zoom = _this.props.zoom;
                    context.fillRect(i * zoom, j * zoom, zoom, zoom);
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

    render() {
        let zoom = this.props.zoom,
            dimension = zoom * SPRITE_HEIGHT;

        return (
            <div>
                <canvas
                    width={dimension}
                    height={dimension}
                    ref="canvas"
                />
            </div>
        );
    }
}