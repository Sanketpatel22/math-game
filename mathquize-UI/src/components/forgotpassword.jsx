import React, { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent to your email.");
    } catch (error) {
      setMessage("Error sending reset email.");
    }
  };

  return (
    <form onSubmit={handleReset} style={styles.form}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Reset Link</button>
      <p>{message}</p>
      <p>
        <Link to="/login">Back to Login</Link>
      </p>
    </form>
  );
};

const styles = {
  form: {
    width: "300px",
    margin: "auto",
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default ForgotPassword;
