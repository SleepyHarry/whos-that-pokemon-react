import React from "react";
import PropTypes from "prop-types";


const options = {
    correct: {
        color: "green",
        icon: "check",
        text: "Correct!",
    },
    nope: {
        color: "red",
        icon: "times",
        text: "Nope!",
    },
    forbidden: {
        color: "red",
        icon: "exclamation-triangle",
        text: "Not enough points!",
    }
};


const StatusBox = (props) => {
    const choice = options[props.option];

    return <div>
        <i className={`fa fa-${choice.icon} fa-5x`} style={{color: choice.color}}/>
        <br/>
        <h3>{choice.text}</h3>
    </div>;
};

StatusBox.propTypes = {
    option: PropTypes.oneOf(Object.keys(options)).isRequired,
};

export default StatusBox;