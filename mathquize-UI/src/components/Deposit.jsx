import React, { useState } from "react";
import "./Deposit.css";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase"; // make sure this is correct

const Deposit = ({ user, setUser }) => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [showQR, setShowQR] = useState(false);
  const [amount, setAmount] = useState(50); // default amount
  const [utr, setUtr] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const presetAmounts = [
    50, 100, 200, 300, 500, 1000, 3000, 5000, 8000, 10000, 20000, 30000,
  ];

  const handleDeposit = () => {
    if (!selectedAmount || selectedAmount <= 0 || selectedAmount < 50) {
      alert("Please enter a valid amount.");
      return;
    }
    setShowQR(true);
  };

  const upiURL = `upi://pay?pa=sanketsutariya1482@axl&pn=abcd&am=${selectedAmount}`;

  const handleUtrChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) setUtr(value);
  };

  const handleSubmit = async () => {
    if (utr.length !== 12) {
      setError("❌ UTR must be exactly 12 digits.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      // const userSnap = await getDoc(userRef);

      // const currentData = userSnap.data();

      // const newBalance = (currentData.balance || 0) + Number(amount);
      // const depositedbal = (currentData.deposits || 0) + Number(amount);

      // 1️⃣ Update main user balance
      await updateDoc(userRef, {
        balance: increment(Number(amount)),
        deposits: increment(Number(amount)),
      });
      // console.log(user.deposits, "111");
      // console.log(user.balance, "111");

      // 2️⃣ Save deposit info into subcollection
      const depositRef = collection(userRef, "deposits");
      await addDoc(depositRef, {
        amount: Number(amount),
        utr,
        timestamp: new Date(),
      });

      setUser((prev) => ({
        ...prev,

        balance: (prev.balance || 0) + Number(amount),
        deposits: (prev.deposits || 0) + Number(amount),
      }));

      navigate("/wallet");
    } catch (err) {
      setError("⚠️ Failed to process deposit.");
      console.error(err);
    }
  };

  const setchanges = (amt) => {
    setAmount(amt);
    setSelectedAmount(amt);
  };

  return (
    <div className="deposit-container">
      <header className="deposit-header">
        <span className="back-btn" onClick={() => navigate("/wallet")}>
          ←
        </span>
        <h2>Deposit</h2>
        <span
          className="history-link"
          onClick={() => navigate("/deposit-history")}
        >
          Deposit history
        </span>
      </header>

      <div className="amount-section">
        <div className="icon">💳</div>
        <h3>Deposit amount</h3>

        <div className="amount-grid">
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              className={
                selectedAmount === amt ? "amount-btn active" : "amount-btn"
              }
              onClick={() => setchanges(amt)}
            >
              ₹{amt >= 1000 ? `${amt / 1000}K` : amt}
            </button>
          ))}
        </div>

        <div className="manual-input">
          ₹
          <input
            type="number"
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(Number(e.target.value))}
          />
          <span className="clear-btn" onClick={() => setSelectedAmount("")}>
            ×
          </span>
        </div>

        <button className="confirm-btn" onClick={handleDeposit}>
          Confirm Deposit ₹{selectedAmount}
        </button>

        {showQR && (
          <div className="qr-section">
            <h4>Scan to Pay</h4>
            <QRCodeCanvas value={upiURL} size={200} />
            {/* <p className="upi-text">{upiURL}</p> */}
          </div>
        )}
      </div>

      {showQR && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          {/* <h2>💳 Deposit ₹{amount}</h2> */}
          {/* <QRCodeCanvas value={upiUrl} size={200} /> */}
          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter 12-digit UTR"
              value={utr}
              onChange={handleUtrChange}
              maxLength={12}
              style={{ padding: "10px", fontSize: "16px", width: "200px" }}
            />
          </div>
          {error && (
            <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
          )}
          <button
            onClick={handleSubmit}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ✅ Confirm Deposit
          </button>
        </div>
      )}
    </div>
  );
};

export default Deposit;
