import React from "react";
import PropTypes from "prop-types";


const WtpTitle = (props) => <div className="title-container">
    <img
        style={{
            width: props.size === "small" ? 583 : 800,
            margin: props.size === "small" ? "26px 57px" : "0 auto",
        }}
        src="/title.png"
    />
</div>;

WtpTitle.propTypes = {
    size: PropTypes.oneOf(["small", "normal"]),
};

WtpTitle.defaultProps = {
    size: "normal",
};

export default WtpTitle;