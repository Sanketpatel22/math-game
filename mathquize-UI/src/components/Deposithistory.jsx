import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, doc, getDocs, orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DepositHistory = ({ user }) => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const depositsRef = collection(userRef, "deposits");
        const q = query(depositsRef, orderBy("timestamp", "desc"));

        const querySnapshot = await getDocs(q);
        const depositData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDeposits(depositData);
      } catch (error) {
        console.error("Error fetching deposit history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [user.uid]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>💳 Deposit History</h2>
      <button
        onClick={() => navigate("/wallet")}
        style={{
          marginBottom: "20px",
          backgroundColor: "#eee",
          padding: "8px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ← Back to Wallet
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : deposits.length === 0 ? (
        <p>No deposit history found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Amount (₹)</th>
              <th style={thStyle}>UTR</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((dep, index) => (
              <tr key={dep.id}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>₹{dep.amount}</td>
                <td style={tdStyle}>{dep.utr}</td>
                <td style={tdStyle}>
                  {new Date(dep.timestamp.seconds * 1000).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Reusable cell styles
const thStyle = {
  padding: "10px",
  borderBottom: "1px solid #ccc",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

export default DepositHistory;
