import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import "./Withdrawalhistory.css";

const WithdrawHistory = ({ user }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return; // safety check

    const fetchRows = async () => {
      try {
        const ref = collection(db, "users", user.uid, "withdrawals");
        const q = query(ref, orderBy("timestamp", "desc"));
        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setRows(data);
      } catch (err) {
        console.error("Error loading withdrawals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRows();
  }, [user]);

  const statusText = (s) =>
    s === 0 ? "Pending" : s === 1 ? "Success" : "Failed";

  return (
    <div className="wh-page">
      <header className="wh-header">
        <span className="wh-back" onClick={() => navigate("/wallet")}>
          ←
        </span>
        <h2>Withdrawal History</h2>
      </header>

      {loading ? (
        <p className="wh-msg">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="wh-msg">No withdrawal records.</p>
      ) : (
        <div className="wh-list">
          {rows.map((r, i) => (
            <div key={r.id} className="wh-card">
              <div className="wh-top">
                <span className="wh-label">Withdraw #{i + 1}</span>
                <span
                  className={
                    r.status === 0
                      ? "wh-status pending"
                      : r.status === 1
                      ? "wh-status success"
                      : "wh-status failed"
                  }
                >
                  {statusText(r.status)}
                </span>
              </div>

              <p>
                <b>Amount:</b> ₹{r.amount}
              </p>
              <p>
                <b>UPI ID:</b> {r.upi}
              </p>
              <p>
                <b>Time:</b>{" "}
                {r.timestamp?.seconds
                  ? new Date(r.timestamp.seconds * 1000).toLocaleString()
                  : "—"}
              </p>
              <p>
                <b>Order #:</b> WD{r.timestamp?.seconds}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WithdrawHistory;
