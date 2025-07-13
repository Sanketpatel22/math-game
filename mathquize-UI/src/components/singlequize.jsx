import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Singlequize.css";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import pic4 from "./images/pic4.jpg";
import pic5 from "./images/pic5.jpg";

const TOTAL_Q = 12;
const TIMER_SECONDS = 100;
const WIN_THRESHOLD = 11;

const SingleQuiz = ({ user, setUser }) => {
  const { state } = useLocation();
  const stake = state?.stake || 0;
  const navigate = useNavigate();

  const [questions] = useState(() => makeQuestions(TOTAL_Q));
  const [qIndex, setQIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTime] = useState(TIMER_SECONDS);
  const [finished, setFinished] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (finished) return;
    if (timeLeft === 0) {
      submitQuiz();
      return;
    }
    const t = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished]);

  const choose = (opt) => {
    if (finished) return;
    const q = questions[qIndex];
    if (opt === q.answer) setCorrect((c) => c + 1);

    if (qIndex === TOTAL_Q - 1) {
      submitQuiz();
    } else {
      setTimeout(() => setQIdx((i) => i + 1), 300);
    }
  };

  const submitQuiz = async () => {
    if (finished) return;
    const didWin = correct >= WIN_THRESHOLD;
    setWin(didWin);
    setFinished(true);

    if (didWin) {
      const prize = Math.round(stake * 1.7);
      try {
        const ref = doc(db, "users", user.uid);
        await updateDoc(
          ref,
          {
            balance: increment(Number(prize)),
            winning: increment(Number(prize)),
          },
          { merge: true }
        );
        setUser((prev) => ({
          ...prev,
          balance: (prev.balance || 0) + Number(prize),
          winning: (prev.winning || 0) + Number(prize),
        }));
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => navigate("/wallet"), 3000);
  };

  if (!stake) {
    navigate("/select-entry");
    return null;
  }

  if (finished)
    return (
      <div className="result-page">
        <div className={`result-card ${win ? "win" : "lose"}`}>
          <h1 className="emoji">{win ? "🎉" : "😢"}</h1>
          <h2 className="headline">{win ? "You Won!" : "You Lost"}</h2>
          <p className="score">
            Score: {correct}/{TOTAL_Q}
          </p>
          {win && (
            <p className="prize">Prize credited: ₹{Math.round(stake * 1.7)}</p>
          )}
          <p className="redirect">Redirecting to wallet…</p>
        </div>
      </div>
    );

  const q = questions[qIndex];

  return (
    <div className="quiz-page">
      {/* Header Section */}
      <div className="quiz-topbar">
        <div className="quiz-timer">⏱ {timeLeft}s</div>
        <div className="quiz-counter">
          Question {qIndex + 1}/{TOTAL_Q}
        </div>
      </div>

      <div className="carousel-box">
        <div className="carousel-track">
          <img src={pic4} alt="slide1" />
          <img src={pic5} alt="slide2" />
        </div>
      </div>

      {/* Question Text */}
      <div className="quiz-question-box">
        <h3>{q.text}</h3>
      </div>

      {/* Options */}
      <div className="quiz-options">
        {q.options.map((opt, i) => (
          <button
            key={i}
            className="quiz-option-btn"
            onClick={() => choose(opt)}
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SingleQuiz;

function makeQuestions(n) {
  const ops = ["+", "-"];
  const list = [];
  for (let i = 0; i < n; i++) {
    const a = 1 + Math.floor(Math.random() * 10);
    const b = 1 + Math.floor(Math.random() * 10);
    const op = ops[Math.floor(Math.random() * ops.length)];
    const ans = op === "+" ? a + b : a - b;

    const opts = new Set([ans]);
    while (opts.size < 4) {
      const wrong = ans + (Math.floor(Math.random() * 7) - 3);
      if (wrong !== ans && wrong >= -10 && wrong <= 20) opts.add(wrong);
    }
    list.push({
      text: `${a} ${op} ${b}`,
      answer: ans,
      options: Array.from(opts).sort(() => 0.5 - Math.random()),
    });
  }
  return list;
}
