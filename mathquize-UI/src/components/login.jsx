import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
        navigate("/tournament");
      } else {
        setError("User record not found.");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div class="loginpage">
      <form onSubmit={handleLogin} id="form">
        <h2 id="login">Login</h2>
        {error && <p id="error">{error}</p>}
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id="pass"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" id="submit">
          Login
        </button>
        <p>
          <Link to="/forgot-password" id="forgot">
            Forgot Password?
          </Link>
        </p>
        <p id="register">
          <span className="newuse">New here? </span>
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

// const styles = {
//   form: {
//     width: "300px",
//     margin: "auto",
//     marginTop: "100px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },
//   error: {
//     color: "red",
//   },
// };

export default Login;
