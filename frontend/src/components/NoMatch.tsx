import React from "react";
import "../css/NoMatch.css";

type Props = {};

const NoMatch = (props: Props) => {
  return (
    <div className="no-match-container">
      <div className="message">
        Page does not exist.
        <a href="/">Go back to Home</a>
      </div>
    </div>
  );
};

export default NoMatch;
