import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Waitingroom.css";

const Waitingroom = ({ user }) => {
  const [status, setStatus] = useState("🔌 Connecting to game...");
  const [room, setRoom] = useState("");
  const [winner, setWinner] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect only once using ref
    socketRef.current = io("http://localhost:4000");

    socketRef.current.on("connect", () => {
      setStatus("🟢 Connected. Waiting for opponent...");
    });

    socketRef.current.on("waiting", (msg) => {
      setStatus(`⏳ ${msg}`);
    });

    socketRef.current.on("startGame", ({ room, players }) => {
      setRoom(room);
      setStatus("✅ Game Started! Click when ready.");
    });

    socketRef.current.on("winner", (playerId) => {
      const youWon = socketRef.current.id === playerId;
      setWinner(youWon ? "🎉 You Won!" : "😢 You Lost!");
    });

    socketRef.current.on("disconnect", () => {
      setStatus("❌ Disconnected from server.");
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleAnswer = () => {
    if (room && socketRef.current) {
      socketRef.current.emit("answer", {
        room,
        playerId: socketRef.current.id,
      });
    }
  };

  return (
    // <div style={{ textAlign: "center", marginTop: "100px" }}>
    //   <h2>{status}</h2>

    //   {room && !winner && (
    //     <button
    //       onClick={handleAnswer}
    //       style={{
    //         padding: "10px 20px",
    //         fontSize: "18px",
    //         backgroundColor: "#007bff",
    //         color: "#fff",
    //         border: "none",
    //         borderRadius: "5px",
    //         cursor: "pointer",
    //       }}
    //     >
    //       Submit Answer
    //     </button>
    //   )}

    //   {winner && (
    //     <h3 style={{ marginTop: "20px", fontSize: "24px" }}>{winner}</h3>
    //   )}
    // </div>

    <div className="waiting-container">
      {/* Top bar */}
      <div className="top-bar"></div>

      {/* Players */}
      <div className="players">
        <div className="player-card">
          <img src="/akshay.png" alt="Akshay" className="avatar" />

          <h4>Akshay</h4>
        </div>

        <div className="vs">VS</div>

        <div className="player-card">
          <img src="/rcb.png" alt="RCB" className="avatar" />

          <h4>RCB</h4>
        </div>
      </div>
    </div>
  );
};

export default Waitingroom;
