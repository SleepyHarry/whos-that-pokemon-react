import React from "react";
import PropTypes from "prop-types";


const WtpTitle = (props) => <img style={{width: props.width}} src="/title.png" />;

WtpTitle.propTypes = {
    width: PropTypes.number,
};

WtpTitle.defaultProps = {
    width: 800,
};

export default WtpTitle;