import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";


class ArcadeButton extends Component {
    render() {
        let {className = "", ...props} = this.props;
        className += " arcade-button";

        return <Button
            className={className}
            {...props}
        >
            {props.children}
        </Button>;
    }
}

ArcadeButton.propTypes = {};

export default ArcadeButton;