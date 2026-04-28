import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Users } from "lucide-react";
import bg from "../assets/bg.svg";

export default function NameScreen({
  mode,
  player1Name,
  setPlayer1Name,
  player2Name,
  setPlayer2Name,
  onBack,
  onContinue,
}) {
  const isBot = mode === "bot";

  function handleContinue() {
    if (!player1Name.trim()) {
      alert("Please enter Player 1 name.");
      return;
    }

    if (!isBot && !player2Name.trim()) {
      alert("Please enter Player 2 name.");
      return;
    }

    onContinue();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "sans-serif",
        background: "#3a9fd4",
      }}
    >
      <img
      src={bg}
      alt=""
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: "rgba(255,255,255,0.96)",
            borderRadius: 26,
            padding: 30,
            boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#e3f2fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              {isBot ? (
                <User size={30} color="#1568a8" />
              ) : (
                <Users size={30} color="#1568a8" />
              )}
            </div>

            <h1
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: "#0a2e4a",
                margin: 0,
              }}
            >
              Enter Names
            </h1>

            <p style={{ color: "#5a8aaa", fontSize: 14 }}>
              {isBot
                ? "Prepare yourself to face Captain Thoni."
                : "Enter both player names to begin the battle."}
            </p>
          </div>

          {/* INPUTS */}
          <div style={{ display: "grid", gap: 14 }}>
            <input
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder="Player 1 name"
              style={inputStyle}
            />

            {!isBot && (
              <input
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Player 2 name"
                style={inputStyle}
              />
            )}

            {isBot && (
              <div style={botBoxStyle}>
                Opponent: Captain Thoni
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
            <button onClick={onBack} style={backBtn}>
              <ArrowLeft size={16} />
              Back
            </button>

            <button onClick={handleContinue} style={continueBtn}>
              Continue
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// STYLES
const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #dceffc",
  background: "#f8fdff",
  fontSize: 15,
  fontWeight: 800,
  outline: "none",
  color: "#0a2e4a",
  caretColor: "#0a2e4a",
};

const botBoxStyle = {
  padding: "14px 16px",
  borderRadius: 16,
  background: "#f4fbff",
  border: "1px solid #dceffc",
  fontWeight: 800,
  color: "#0a2e4a",
};

const backBtn = {
  flex: 1,
  padding: "13px",
  borderRadius: 14,
  border: "none",
  background: "#e8f4fb",
  color: "#1568a8",
  fontWeight: 800,
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
};

const continueBtn = {
  flex: 1.2,
  padding: "13px",
  borderRadius: 14,
  border: "none",
  background: "#1568a8",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
  boxShadow: "0 5px 0 #0f5590",
};