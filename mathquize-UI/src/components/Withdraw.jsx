import React, { useState } from "react";
import "./Withdraw.css";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 *  props:
 *    user      – current user object  (must contain user.id and balance)
 *    setUser   – setter from App so balance updates instantly
 */
const Withdraw = ({ user, setUser }) => {
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const maxBalance = user.winning || 0;

  const handleAll = () => setAmount(maxBalance);

  const handleSubmit = async () => {
    // simple validation
    if (!amount || Number(amount) <= 0) {
      return setError("Enter a valid amount");
    }
    if (Number(amount) > maxBalance) {
      return setError("Amount exceeds balance");
    }
    if (!/^\w+@\w+$/.test(upi)) {
      return setError("Enter a valid UPI ID (e.g. name@bank)");
    }

    if (Number(amount) < 100) {
      return setError("Minimun 100 Rupees withdraval ");
    }

    try {
      // 1️⃣ update Firestore balance
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      const data = snap.data();
      const newwinbal = (data.winning || 0) - Number(amount);
      const newbal = (data.balance || 0) - Number(amount);

      await updateDoc(userRef, { winning: newwinbal, balance: newbal });

      // 2️⃣ save withdrawal record
      const wRef = collection(userRef, "withdrawals");
      await addDoc(wRef, {
        amount: Number(amount),
        upi,
        timestamp: new Date(),
        status: 0, // 🕓 0 = pending
      });

      // 3️⃣ update local state & go back
      setUser({ ...data, balance: newbal, winning: newwinbal });
      navigate("/wallet");
    } catch (err) {
      console.error(err);
      setError("Withdrawal failed. Try again.");
    }
  };

  return (
    <div className="withdraw-page">
      {/* header */}
      <header className="wd-header">
        <span className="back" onClick={() => navigate("/wallet")}>
          ←
        </span>
        <h2>Withdraw</h2>
        <span
          className="hist-link"
          onClick={() => navigate("/withdraw-history")}
        >
          Withdrawal history
        </span>
      </header>

      {/* card */}
      <div className="wd-card">
        <div className="balance-row">
          Withdrawable balance <b>₹{maxBalance.toFixed(2)}</b>
          <button onClick={handleAll} className="all-btn">
            All
          </button>
        </div>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="amount-input"
        />

        <input
          type="text"
          placeholder="Enter UPI ID"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          className="upi-input"
        />

        {error && <p className="wd-error">{error}</p>}

        <button className="withdraw-btn" onClick={handleSubmit}>
          Withdraw
        </button>

        {/* helpful notes (static) */}
        <ul className="wd-notes">
          <li>Need to bet ₹0.00 to be able to withdraw</li>
          <li>Withdrawal time 00:00 – 23:59</li>
          <li>Daily remaining withdrawals: 3</li>
          <li>Withdrawal range ₹110 – ₹500 000</li>
          <li>
            Please confirm your beneficiary account information before
            withdrawing.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Withdraw;
