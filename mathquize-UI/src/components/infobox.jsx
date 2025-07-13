import React from "react";
import "./ifoBox.css";

/**
 * InfoBox
 * @param {string[]} points – array of bullet‑point strings
 */
const InfoBox = ({ points }) => {
  if (!points?.length) return null;

  return (
    <div className="info-box">
      <ul>
        {points.map((text, i) => (
          <li key={i}>{text}</li>
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
