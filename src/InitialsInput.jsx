import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";


class InitialsInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }

    onChange(e) {
        e.target.value = e.target.value.slice(0, 3).toUpperCase();

        this.setState({
            value: e.target.value,
        });
    }

    onKeyUp(e) {
        if (e.key === "Enter") {
            this.props.submit(this.state.value);
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
                    onChange={this.onChange.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                />
            </div>
            <Button
                type="submit"
                onClick={() => { this.props.submit(this.state.value); }}
            >
                Submit
            </Button>
        </div>
    }
}

InitialsInput.propTypes = {
    submit: PropTypes.func.isRequired,
};

export default InitialsInput;