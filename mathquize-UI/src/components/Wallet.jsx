import React from "react";
import "./Wallet.css";
import { useNavigate } from "react-router-dom";

const Wallet = ({ user }) => {
  const navigate = useNavigate();

  // These three values must already exist in your user object
  const deposit = user.deposits || 0; // 💳 top‑ups
  const winning = user.winning || 0; // 🏆 prizes
  const total = user.balance || 0; // 💰 total balance
  // console.log(user.deposits);
  // console.log(deposit);
  // console.log(user.uid);
  // console.log(winning);
  // console.log(total);
  return (
    <div>
      <header className="header">
        <button className="wallet-back" onClick={() => navigate("/")}>
          <span> ←</span>
        </button>
        <div className="title">Math Quiz</div>

        {/* Wallet icon with balance */}
        <div
          className="wallet"
          onClick={() => navigate("/wallet")}
          style={{
            marginRight: "20px",
            cursor: "pointer",
            background: "#612e2e",
            padding: "8px 12px",
            borderRadius: "20px",
            fontWeight: "bold",
          }}
        >
          💰 ₹{user.balance}
        </div>
      </header>

      <div className="wallet-page">
        <h2 className="wallet-title">👛 Wallet</h2>

        {/* Three-way balance summary */}
        <div className="wallet-summary-grid">
          <div className="wallet-box deposit">
            <h3>₹{deposit.toFixed(2)}</h3>
            <p>Deposit Amount</p>
          </div>

          <div className="wallet-box winning">
            <h3>₹{winning.toFixed(2)}</h3>
            <p>Winning Amount</p>
          </div>

          <div className="wallet-box total">
            <h3>₹{total.toFixed(2)}</h3>
            <p>Total Balance</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={() => navigate("/deposit")}>💳 Deposit</button>
          <button onClick={() => navigate("/withdraw")}>🏧 Withdraw</button>
          <button onClick={() => navigate("/deposit-history")}>
            📜 Deposit History
          </button>
          <button onClick={() => navigate("/withdraw-history")}>
            🧾 Withdrawal History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
