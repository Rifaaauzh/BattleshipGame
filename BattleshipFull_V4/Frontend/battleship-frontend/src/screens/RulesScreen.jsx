import { motion } from "framer-motion";
import { Bot, Users, ArrowLeft, ArrowRight } from "lucide-react";
import bg from "../assets/bg.svg";

export default function RulesScreen({ mode, onBack, onContinue }) {
  const isBot = mode === "bot";

  const rules = isBot
    ? [
        "You will play against the Captain Thoni (bot).",
        "Place your ships before the battle starts.",
        "Attack one enemy tile each turn.",
        "If you hit an enemy ship, you get another turn.",
        "Captain Thoni will attack after your turn ends.",
        "Sink all his ships to win! ",
      ]
    : [
        "Two players will play on the same device.",
        "Each player places ships before battle.",
        "Players take turns attacking enemy tiles.",
        "If you hit a ship, you get another turn.",
        "Do not look at the opponent’s board.",
        "First player to sink all ships wins.",
      ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
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
            maxWidth: 740,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 26,
            padding: 30,
            boxShadow: "0 12px 36px rgba(0,0,0,0.24)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <p
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#1568a8",
                margin: "0 0 8px",
              }}
            >
              Ahoy, Mate!
            </p>

            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#7aaed0",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {isBot ? "1 Player Mode" : "2 Player Mode"}
            </p>

            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 52px)",
                fontWeight: 900,
                color: "#0a2e4a",
                margin: "6px 0",
                lineHeight: 1,
              }}
            >
              Rules
            </h1>

            <p style={{ fontSize: 14, color: "#5a8aaa", margin: 0 }}>
              Read this before sailing into battle.
            </p>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {rules.map((rule, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  background: "#f4fbff",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid #dceffc",
                }}
              >
                <div
                  style={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#1568a8",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#0a2e4a",
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {rule}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={onBack}
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
                gap: 6,
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              onClick={onContinue}
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
                gap: 6,
                boxShadow: "0 5px 0 #0f5590",
              }}
            >
              Start Game
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}