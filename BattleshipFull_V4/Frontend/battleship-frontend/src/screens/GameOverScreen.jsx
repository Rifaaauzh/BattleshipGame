import { motion } from "framer-motion";
import { Trophy, RotateCcw, Home } from "lucide-react";
import bg from "../assets/bg.svg";

export default function GameOverScreen({
  mode,
  winner,
  onPlayAgain,
  onMainMenu,
}) {
  const isBot = mode === "bot";
  const isPlayerWinner = isBot && winner !== "Captain Thoni";

  const title = isBot
    ? isPlayerWinner
      ? "You Win!"
      : "You Lose!"
    : `Captain ${winner || "Player"} Wins!`;

  const subtitle = isBot
    ? isPlayerWinner
      ? "Great job, captain. You sank the enemy fleet."
      : "Captain Thoni sank your fleet. Better luck next battle."
    : `Captain ${winner || "The winner"} has conquered the seas.`;

  const winnerLabel = isBot
    ? isPlayerWinner
      ? `Captain ${winner}`
      : "Captain Thoni"
    : `Captain ${winner || "Player"}`;

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

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 28,
            padding: 34,
            boxShadow: "0 12px 36px rgba(0,0,0,0.24)",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#1568a8",
              margin: "0 0 10px",
            }}
          >
            Battle Finished!
          </p>

          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: 22,
              background: "#fff3c4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 6px 0 #e5b93f",
            }}
          >
            <Trophy size={42} color="#b7791f" />
          </div>

          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: "#7aaed0",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {isBot ? "1 Player Result" : "2 Player Result"}
          </p>

          <h1
            style={{
              fontSize: "clamp(42px, 8vw, 72px)",
              fontWeight: 900,
              color: "#0a2e4a",
              margin: "8px 0 10px",
              lineHeight: 1,
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "#5a8aaa",
              margin: "0 auto",
              maxWidth: 440,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>

          <div
            style={{
              marginTop: 28,
              padding: "16px",
              borderRadius: 20,
              background: "#f4fbff",
              border: "1px solid #dceffc",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#5a8aaa",
                fontWeight: 700,
              }}
            >
              Winner
            </p>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: 26,
                color: "#1568a8",
                fontWeight: 900,
              }}
            >
              {winnerLabel}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
            <button
              onClick={onMainMenu}
              style={{
                flex: 1,
                padding: "13px 12px",
                borderRadius: 14,
                border: "none",
                background: "#e8f4fb",
                color: "#1568a8",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <Home size={17} />
              Main Menu
            </button>

            <button
              onClick={onPlayAgain}
              style={{
                flex: 1.2,
                padding: "13px 12px",
                borderRadius: 14,
                border: "none",
                background: "#1568a8",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                boxShadow: "0 5px 0 #0f5590",
              }}
            >
              <RotateCcw size={17} />
              Play Again
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}