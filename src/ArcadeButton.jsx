import React, {Component} from "react";
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

ArcadeButton.propTypes = Button.propTypes;

export default ArcadeButton;