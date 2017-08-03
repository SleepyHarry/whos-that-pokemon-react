import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";


class ArcadeButton extends Component {
    render() {
        return <Button {...this.props}>{this.props.children}</Button>;
    }
}

ArcadeButton.propTypes = {};

export default ArcadeButton;