import React, {Component} from "react";
import PropTypes from "prop-types";
import ArcadeButton from "./ArcadeButton";


class InitialsInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };

        setTimeout(() => {
            this.input.focus();
        }, 1000);
    }

    onChange(e) {
        e.target.value = e.target.value.slice(0, 3).toUpperCase().replace(" ", "");

        this.setState({
            value: e.target.value,
        });
    }

    onKeyUp(e) {
        if (e.key === "Enter") {
            this.submit(this.state.value);
        }
    }

    submit(value) {
        // TODO: Warn / notify when brick
        if (value.length === 3) {
            this.props.submit(value);
        }
    }

    render() {
        const val = this.state.value + '___'.slice(this.state.value.length);

        return <div className="initials-input">
            <span>Enter initials:</span>
            <div className="initials-input-input">
                {val.split('').map((c, i) => {
                    let classes = [];
                    const len = this.state.value.length;

                    if (i === len && document.activeElement === this.input) classes.push('blink');
                    if (i >= len) classes.push('faded');
                    return <span
                        key={i}
                        className={classes.join(' ')}
                    >
                        {c}
                    </span>;
                })}
                <input
                    type="text"
                    ref={(input) => { this.input = input; }}
                    value={this.state.value}
                    onFocus={() => { this.forceUpdate(); }}
                    onBlur={() => { this.forceUpdate(); }}
                    onChange={this.onChange.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                />
            </div>
            <ArcadeButton
                type="submit"
                onClick={() => { this.submit(this.state.value); }}
            >
                Submit
            </ArcadeButton>
        </div>
    }
}

InitialsInput.propTypes = {
    submit: PropTypes.func.isRequired,
};

export default InitialsInput;