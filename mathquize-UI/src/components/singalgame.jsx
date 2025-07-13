import React, { useState } from "react";
import "./Singlegame.css";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import InfoBox from "./infobox";

/**
 *  Props:
 *    user      – the logged‑in user object
 *    setUser   – updater from App.jsx (so balance refreshes)
 */
const SelectEntry = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [stake, setStake] = useState(10); // default ₹10
  const [error, setError] = useState("");

  const stakes = [10, 20, 50, 100, 200, 500];

  const walletNotes = [
    "in every game if you win then get 1.7x money",
    "in every game 12 question and 15sec ",
    "you have to give 11 or 12 asnswer right",
  ];

  const handlePlay = async () => {
    /* 1️⃣  Make sure the player can afford the stake */
    if (user.balance < stake) {
      return setError("Insufficient balance.");
    }

    try {
      /* 2️⃣  Work out how much to take from each pot */
      let remaining = stake;
      let deductFromDeposits = 0;
      let deductFromWinning = 0;

      if (user.deposits >= remaining) {
        // deposits cover everything
        deductFromDeposits = remaining;
        remaining = 0;
      } else {
        // use all deposits, take rest from winning
        deductFromDeposits = user.deposits;
        remaining -= user.deposits;
        deductFromWinning = remaining; // whatever is still needed
      }

      /* 3️⃣  Update local React state so UI refreshes instantly */
      setUser((prev) => ({
        ...prev,
        balance: prev.balance - stake,
        deposits: prev.deposits - deductFromDeposits,
        winning: prev.winning - deductFromWinning,
      }));

      /* 4️⃣  Persist to Firestore atomically */
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        balance: increment(-stake),
        deposits: increment(-deductFromDeposits),
        winning: increment(-deductFromWinning),
      });

      /* 5️⃣  Navigate into the quiz, passing the stake along */
      navigate("/single-quiz", { state: { stake } });
    } catch (err) {
      console.error("Stake error", err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="entry-page">
      <h2>Select Entry Price</h2>

      <div className="stake-grid">
        {stakes.map((s) => (
          <button
            key={s}
            className={stake === s ? "stake-btn active" : "stake-btn"}
            onClick={() => setStake(s)}
          >
            ₹{s}
          </button>
        ))}
      </div>

      <p className="reward-text">
        Win&nbsp;
        <span className="reward-amount">₹{(stake * 1.7).toFixed(0)}</span>
        &nbsp;if you answer all questions!
      </p>

      {error && <p className="err">{error}</p>}

      <button className="play-btn" onClick={handlePlay}>
        Play for ₹{stake}
      </button>

      <p className="bal">Current Balance: ₹{user.balance}</p>

      <InfoBox points={walletNotes} />
    </div>
  );
};

export default SelectEntry;
