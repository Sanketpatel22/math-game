import { useNavigate } from "react-router-dom";

import "./Gamecard.css";
import singlegame from "./images/singlegame.png";

const BackToTournaments = () => {
  const navigate = useNavigate();

  return (
    <img
      src={singlegame}
      alt="Back"
      className="back-img"
      onClick={() => navigate("/singlegame")} // same route as before
    />
  );
};

export default BackToTournaments;
