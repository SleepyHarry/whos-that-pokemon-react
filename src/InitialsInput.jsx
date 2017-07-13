import React, {Component} from "react";
import PropTypes from "prop-types";


class InitialsInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <input {...this.props}/>
    }
}

InitialsInput.propTypes = {};

export default InitialsInput;