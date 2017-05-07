import React, {Component} from 'react';


const SPRITE_HEIGHT = 96,
      ZOOM = 6;

export default class Pokemon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: false,
            spriteData: undefined,
        };

    }

    rgbToHex({r, g, b}) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);

        if (r.length === 1) r = '0' + r;
        if (g.length === 1) g = '0' + g;
        if (b.length === 1) b = '0' + b;

        return '#' + r + b + g;
    }

    pad(num) {
        let s = num + '';
        return '000'.substring(0, 3 - s.length) + s;
    }

    componentDidMount() {
        let _this = this;

        const canvas = this.refs.canvas,
              context = canvas.getContext('2d');

        let pokeImg = new Image();
            pokeImg.src = `/sprites/${this.pad(this.props.number)}.png`;

        pokeImg.onload = function () {
            context.drawImage(this, 0, 0, SPRITE_HEIGHT, SPRITE_HEIGHT,
                                    0, 0, SPRITE_HEIGHT, SPRITE_HEIGHT);

            let imgData = context.getImageData(0, 0, canvas.width, canvas.height).data;

            let spriteData = [];
            for (let i=0; i < SPRITE_HEIGHT; i++) {
                spriteData.push([]);
            }
            for (let x=0; x<SPRITE_HEIGHT; x++) {
                for (let y=0; y<SPRITE_HEIGHT; y++) {
                    let i = (y * canvas.width + x) * 4;

                    spriteData[x][y] = (
                        imgData[i + 3] ? _this.rgbToHex({r: imgData[i], b: imgData[i+1], g: imgData[i+2]}) : null
                    );
                }
            }

            _this.setState({
                spriteData: spriteData,
            });
        };
    }

    componentDidUpdate() {
        const canvas = this.refs.canvas,
              context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);

        console.log('painting...');
        for (let i = 0; i < SPRITE_HEIGHT; i++) {
            for (let j = 0; j < SPRITE_HEIGHT; j++) {
                if (this.state.hidden) {
                    context.fillStyle = ((this.state.spriteData[i][j] && 'rgb(64,64,64)') || 'rgba(0,0,0,0.0)');
                } else {
                    context.fillStyle = (this.state.spriteData[i][j] || 'rgba(0,0,0,0.0)');
                }
                context.fillRect(i * ZOOM, j * ZOOM, ZOOM, ZOOM);
            }
        }
        console.log('done painting!');
    }

    onClick() {
        this.setState(prevState => ({
            hidden: !prevState.hidden,
        }));
    }

    render() {
        return (
            <div onClick={this.onClick.bind(this)}>
                <canvas width={576} height={576} ref="canvas" />
            </div>
        );
    }
}