import React, { useState } from "react";
import "./TournamentList.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import pic1 from "./images/pic1.jpg";
import pic2 from "./images/pic2.jpg";
import pic3 from "./images/pic3.jpg";
import BackToTournaments from "./gamecard";

const tournaments = [{ id: 1, name: "Math Masters", entryFee: 10, prize: 17 }];

const TournamentList = ({ user, setUser }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user.username);
  const navigate = useNavigate();

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setEditingName(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleJoin = (tournament) => {
    if (user.balance < tournament.entryFee) {
      alert("Insufficient balance!");
      return;
    }

    const didWin = Math.random() < 0.5;

    const updatedUser = {
      ...user,
      balance:
        user.balance - tournament.entryFee + (didWin ? tournament.prize : 0),
      played: user.played + 1,
      deposits: user.deposits,
      winning: user.winning,
      wins: user.wins + (didWin ? 1 : 0),
    };

    setUser(updatedUser);
    alert(`You ${didWin ? "won" : "joined"} ${tournament.name}!`);
  };

  const handleNameChange = () => {
    if (newName.trim()) {
      const updatedUser = { ...user, username: newName.trim() };
      setUser(updatedUser);
      setEditingName(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
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

        <div className="profile-wrapper">
          <div className="profile-circle" onClick={toggleProfile}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          {showProfile && (
            <div className="profile-dropdown">
              {editingName ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="username-input"
                  />
                  <button className="save-btn" onClick={handleNameChange}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <strong>👤 {user.username}</strong>
                  </p>
                  <button
                    className="edit-btn"
                    onClick={() => setEditingName(true)}
                  >
                    ✏️ Change Name
                  </button>
                </>
              )}
              <hr />
              <p>🎮 Played: {user.played}</p>
              <p>🏆 Wins: {user.wins}</p>
              <p>💰 Balance: ₹{user.balance}</p>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tournaments Section */}
      {/* single game  */}
      <div className="tournament-container">
        <div className="carousel-box">
          <div className="carousel-track">
            <img src={pic1} alt="slide1" />
            <img src={pic2} alt="slide2" />
            <img src={pic3} alt="slide3" />
          </div>
        </div>

        <h2 style={{ color: "white" }}>🏁 Available Tournaments</h2>
        <div className="tournament-list">
          <BackToTournaments />
        </div>
      </div>

      {/* ----------  FAQ Section  ---------- */}
      <div className="faq-section">
        <h3 className="faq-title">❓ FAQ</h3>

        <div className="faq-item">
          <input type="checkbox" id="q1" />
          <label htmlFor="q1">How do I join a tournament?</label>
          <p className="faq-answer">
            Click “Start Game”, pay the entry fee, and you’ll be matched
            automatically.
          </p>
        </div>

        <div className="faq-item">
          <input type="checkbox" id="q2" />
          <label htmlFor="q2">Where can I see my winnings?</label>
          <p className="faq-answer">
            Your winnings are added to the 🏆 Winning Amount in the wallet page.
          </p>
        </div>

        <div className="faq-item">
          <input type="checkbox" id="q3" />
          <label htmlFor="q3">How long does a withdrawal take?</label>
          <p className="faq-answer">
            Withdrawal requests are processed within 24 hours on business days.
          </p>
        </div>

        <div className="faq-item">
          <input type="checkbox" id="q4" />
          <label htmlFor="q4">why my withdrawal Request Failed?</label>
          <p className="faq-answer">
            Beacause you might have followed wrong practices.
          </p>
        </div>
      </div>

      <footer className="footer-nav">
        <button onClick={() => navigate("/")}>🏠</button>
        <button onClick={() => navigate("/wallet")}>💰</button>
        <button onClick={toggleProfile}>👤</button>
      </footer>
    </div>
  );
};

export default TournamentList;
