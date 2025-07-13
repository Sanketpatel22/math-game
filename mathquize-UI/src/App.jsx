import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TournamentList from "./components/tournaments";
import Login from "./components/login";
import Register from "./components/registration";
import ForgotPassword from "./components/forgotpassword";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Wallet from "./components/Wallet";
import Deposit from "./components/Deposit";
import DepositHistory from "./components/Deposithistory";
import Withdraw from "./components/Withdraw";
import WithdrawHistory from "./components/Withdrawalhistory";
import Waitingroom from "./components/Waitingroom";
import SelectEntry from "./components/singalgame";
import SingleQuiz from "./components/singlequize";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data());
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/tournament"
          element={
            currentUser ? (
              <TournamentList user={currentUser} setUser={setCurrentUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login setUser={setCurrentUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/singlegame"
          element={<SelectEntry user={currentUser} setUser={setCurrentUser} />}
        />

        <Route
          path="/single-quiz"
          element={<SingleQuiz user={currentUser} setUser={setCurrentUser} />}
        />

        <Route
          path="/doublegame"
          element={
            currentUser ? (
              <Waitingroom user={currentUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/wallet" element={<Wallet user={currentUser} />} />
        <Route
          path="/deposit"
          element={<Deposit user={currentUser} setUser={setCurrentUser} />}
        />
        <Route
          path="/withdraw"
          element={<Withdraw user={currentUser} setUser={setCurrentUser} />}
        />
        <Route
          path="/deposit-history"
          element={<DepositHistory user={currentUser} />}
        />
        <Route
          path="/withdraw-history"
          element={<WithdrawHistory user={currentUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
