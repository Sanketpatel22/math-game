import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./Registration.css"; // Make sure this path matches your file structure

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) return setError("Passwords do not match");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          email,
          username,
          balance: 10,
          deposits: 10,
          winning: 0,
          played: 0,
          wins: 0,
        },
        { merge: true }
      );

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="regipage">
      <form onSubmit={handleRegister} id="regiform">
        <h2 id="register-title">Register</h2>
        {error && <p className="error-text">{error}</p>}
        <input
          type="email"
          id="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          id="confirm"
          placeholder="Confirm Password"
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit" id="submit">
          Register
        </button>
        <p id="login-link">
          <span className="log"> Already have an account? </span>
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
