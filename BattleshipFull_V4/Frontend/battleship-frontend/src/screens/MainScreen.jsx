import { motion } from "framer-motion";
import { Bot, Users } from "lucide-react";
import bg from "../assets/bg.svg";

export default function MainScreen({ onSelectMode }) {
  return (
    <div
      className="fullscreen"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      <img
        src={bg}
        alt="background"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* wrapper utama (biar di atas background) */}
      <motion.div
        initial={{ opacity: 0, y: 28 }} // animasi masuk dikit
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 20,
          padding: "0 24px",
        }}
      >
        {/* title section */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(220,240,255,0.65)", textTransform: "uppercase", marginBottom: 10 }}>
            Naval Strategy
          </p>

          {/* judul game */}
          <h1 style={{ fontSize: "clamp(52px, 9vw, 84px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1, margin: 0, textShadow: "0 3px 20px rgba(0,50,100,0.35)" }}>
            Battle<span style={{ color: "#ffe066" }}>ship</span>
          </h1>

          {/* deskripsi */}
          <p style={{ marginTop: 12, fontSize: 15, color: "rgba(220,240,255,0.7)", fontWeight: 400 }}>
            Hunt down the enemy fleet and sink them before it's too late
          </p>
        </div>

        {/* pilihan mode game */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            width: "100%",
            maxWidth: 480,
            marginTop: 8,
          }}
        >
          {[
            {
              mode: "bot",
              label: "Solo",
              title: "1 Player",
              desc: "Face Bot and prove your tactical skills",
              hint: "Play with bot →",
              Icon: Bot,
            },
            {
              mode: "twoPlayer",
              label: "Co-op",
              title: "2 Player",
              desc: "Pass & play with a friend, take turns",
              hint: "Play with friend →",
              Icon: Users,
            },
          ].map(({ mode, label, title, desc, hint, Icon }) => (
            <button
              key={mode}
              onClick={() => onSelectMode(mode)} // trigger pilih mode
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "24px 16px 48px",
                borderRadius: 20,
                background: "#fff",
                border: "none",
                cursor: "pointer",
                overflow: "hidden",
                boxShadow: "0 6px 0px #7ab8d8, 0 10px 30px rgba(0,0,0,0.2)",
                transition: "transform 0.12s, box-shadow 0.12s",
              }}
              // efect click 
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 9px 0px #7ab8d8, 0 14px 36px rgba(0,0,0,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 0px #7ab8d8, 0 10px 30px rgba(0,0,0,0.2)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(4px)";
                e.currentTarget.style.boxShadow =
                  "0 2px 0px #7ab8d8, 0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 9px 0px #7ab8d8, 0 14px 36px rgba(0,0,0,0.22)";
              }}
            >
              {/* icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#deeef8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={26} color="#1568a8" />
              </div>

              {/* text */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "#7aaccf", textTransform: "uppercase", marginBottom: 4 }}>
                  {label}
                </p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#0a2e4a", margin: 0 }}>
                  {title}
                </p>
                <p style={{ fontSize: 12, color: "#5a8aaa", marginTop: 6, lineHeight: 1.45 }}>
                  {desc}
                </p>
              </div>

              {/* hint bawah (muncul pas hover) */}
              <div
                className="card-hint"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "#1568a8",
                  padding: "10px 0",
                  transform: "translateY(100%)",
                  transition: "transform 0.2s ease",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.06em",
                    margin: 0,
                  }}
                >
                  {hint}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* hover trigger buat hint */}
      <style>{`
        button:hover .card-hint {
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}