import React from "react";
import PropTypes from "prop-types";


const WtpTitle = (props) => <div className="title-container">
    <img
        style={{
            width: props.width,
            margin: "0 auto",
        }}
        src="/title.png"
    />
</div>;

WtpTitle.propTypes = {
    width: PropTypes.number,
};

WtpTitle.defaultProps = {
    width: 800,
};

export default WtpTitle;