import React from "react";
import PropTypes from "prop-types";
import Score from "./Score";


const LeaderboardEntry = (props) => {
    const rank = props.rank < 10 ?
        <span>&nbsp;{props.rank}&nbsp;</span> :
        <span>&nbsp;{props.rank}</span>;

    return <div
        className={"spaced-content " + (props.distinguish ? "distinguished" : "")}
    >
        {rank} <Score className="score score-leaderboard" score={props.children.score} length={6}/> {props.children.initials}&nbsp;
    </div>;
};

LeaderboardEntry.propTypes = {
    rank: PropTypes.number.isRequired,
    distinguish: PropTypes.bool,
    children: PropTypes.shape({
        initials: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
    }),
};

LeaderboardEntry.defaultProps = {
    distinguish: false,
};

export default LeaderboardEntry;