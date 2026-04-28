import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair } from "lucide-react";
import bg from "../assets/bg.svg";

const BOARD_SIZE = 10;

function createBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => "empty")
  );
}

function cellsToBoard(cells) {
  const board = createBoard();

  cells.forEach((cell) => {
    board[cell.y][cell.x] = cell.state;
  });

  return board;
}

export default function AttackScreen({ mode, player1Name, player2Name, onGameOver }) {
  const [playerBoard, setPlayerBoard] = useState(createBoard);
  const [enemyBoard, setEnemyBoard] = useState(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState(player1Name || "Player 1");
  const [opponent, setOpponent] = useState(
    mode === "bot" ? "Captain Thoni" : player2Name || "Player 2"
  );
  const [message, setMessage] = useState("Choose a tile to attack.");
  const [result, setResult] = useState("Ready");
  const [isChangingTurn, setIsChangingTurn] = useState(false);

  const isBot = mode === "bot";
  const activeBoard = enemyBoard;

  useEffect(() => {
    loadBoard();
  }, []);

  async function loadBoard() {
    try {
      const response = await fetch("http://localhost:5230/api/game/board");

      const result = await response.json();

      if (!result.isSuccess) {
        setMessage(result.message);
        return;
      }

      const data = result.data;

      setPlayerBoard(cellsToBoard(data.playerBoard));
      setEnemyBoard(cellsToBoard(data.enemyBoard));
      setCurrentPlayer(data.currentPlayer);
      setOpponent(data.opponent);

      if (data.winner) {
        onGameOver(data.winner);
      }
    } catch (error) {
      setMessage("Could not connect to backend.");
    }
  }

  async function attackCell(row, col) {
    if (isChangingTurn) return;

    if (activeBoard[row][col] !== "empty") {
      setMessage("You already attacked this tile.");
      return;
    }

    setIsChangingTurn(true);
    setMessage("Cannon fired... waiting for impact!");
    setResult("Firing");

    try {
      const response = await fetch("http://localhost:5230/api/game/shoot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x: col,
        y: row,
      }),
    });

    const result = await response.json();

    if (!result.isSuccess) {
      setMessage(result.message);
      setIsChangingTurn(false);
      return;
    }

    const data = result.data;

      await new Promise((resolve) => setTimeout(resolve, 900));

      let fullMessage = data.message;

      if (data.botMessages && data.botMessages.length > 0) {
        const botHitCount = data.botMessages.filter((msg) =>
          msg.includes("hit")
        ).length;

        if (botHitCount > 0) {
          const hitText = botHitCount === 1 ? "once" : `${botHitCount} times`;
          fullMessage = `${data.message} Captain Thoni hit your ship ${hitText}, then missed. Your turn!`;
        } else {
          fullMessage = `${data.message} Captain Thoni missed. Your turn!`;
        }
      }
      setResult(formatResult(data.result));
      setMessage(fullMessage);
      setCurrentPlayer(data.currentPlayer);

      await loadBoard();

      if (data.winner) {
        onGameOver(data.winner);
        return;
      }
    } catch (error) {
      setMessage("Could not connect to backend.");
    }

    setIsChangingTurn(false);
  }

  function formatResult(value) {
    if (value === "hit") return "Hit";
    if (value === "miss") return "Miss";
    if (value === "sunk") return "Sunk";
    if (value === "win") return "Win";
    return "Ready";
  }

  function getCellText(status) {
    if (status === "hit") return "✕";
    if (status === "sunk") return "✕";
    if (status === "miss") return "○";
    return "";
  }

  function getCellStyle(status) {
    if (status === "sunk") {
      return {
        background: "#0a2e4a",
        color: "#fff",
        border: "1px solid #061420",
        boxShadow: "0 3px 0 #061420",
      };
    }

    if (status === "hit") {
      return {
        background: "#ef4444",
        color: "#fff",
        border: "1px solid #dc2626",
        boxShadow: "0 3px 0 #b91c1c",
      };
    }

    if (status === "miss") {
      return {
        background: "#e8f4fb",
        color: "#1568a8",
        border: "1px solid #b9dff3",
      };
    }

    return {
      background: "#f8fdff",
      color: "#0a2e4a",
      border: "1px solid #b9dff3",
    };
  }

  function getNotificationStyle() {
    const isSunk = result.includes("Sunk") || result === "Sunk";
    const isHit = result.includes("Hit") || result === "Hit";
    const isMiss = result.includes("Miss") || result === "Miss";

    if (isSunk) {
      return {
        background: "#e7ecf2",
        border: "1px solid #cbd5e1",
        color: "#0a2e4a",
      };
    }

    if (isHit) {
      return {
        background: "#ffe8e8",
        border: "1px solid #fecaca",
        color: "#b42318",
      };
    }

    if (isMiss) {
      return {
        background: "#e8f4fb",
        border: "1px solid #dceffc",
        color: "#1568a8",
      };
    }

    return {
      background: "#f4fbff",
      border: "1px solid #dceffc",
      color: "#1568a8",
    };
  }

  const notificationStyle = getNotificationStyle();

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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          height: "100%",
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
            maxWidth: 1080,
            background: "rgba(255,255,255,0.96)",
            borderRadius: 28,
            padding: 26,
            boxShadow: "0 12px 36px rgba(0,0,0,0.24)",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: "#1568a8",
              margin: "0 0 6px",
            }}
          >
            Attack Phase
          </p>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 46px)",
              fontWeight: 900,
              color: "#0a2e4a",
              margin: 0,
              lineHeight: 1,
            }}
          >
            Captain {currentPlayer}'s Turn
          </h1>

          <motion.div
            key={message}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              marginTop: 12,
              marginBottom: 18,
              padding: "12px 16px",
              borderRadius: 16,
              background: notificationStyle.background,
              border: notificationStyle.border,
            }}
          >
            <p
              style={{
                margin: 0,
                color: notificationStyle.color,
                fontWeight: 900,
              }}
            >
              {message}
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 310px",
              gap: 22,
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "#e8f4fb",
                borderRadius: 22,
                padding: 16,
                border: "1px solid #cde7f7",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                  gap: 5,
                }}
              >
                {activeBoard.map((rowData, rowIndex) =>
                  rowData.map((cell, colIndex) => (
                    <motion.button
                      key={`${currentPlayer}-${rowIndex}-${colIndex}`}
                      onClick={() => attackCell(rowIndex, colIndex)}
                      whileHover={
                        cell === "empty" && !isChangingTurn ? { scale: 1.06 } : {}
                      }
                      whileTap={
                        cell === "empty" && !isChangingTurn ? { scale: 0.92 } : {}
                      }
                      disabled={isChangingTurn}
                      style={{
                        aspectRatio: "1 / 1",
                        borderRadius: 8,
                        cursor:
                          cell === "empty" && !isChangingTurn
                            ? "pointer"
                            : "not-allowed",
                        fontSize: 24,
                        fontWeight: 900,
                        transition: "0.12s",
                        ...getCellStyle(cell),
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {cell !== "empty" && (
                          <motion.span
                            key={cell}
                            initial={{
                              scale: 0,
                              rotate: cell === "hit" || cell === "sunk" ? -25 : 0,
                              opacity: 0,
                            }}
                            animate={{
                              scale: [0, 1.25, 1],
                              rotate: 0,
                              opacity: 1,
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              duration: 0.28,
                              ease: "easeOut",
                            }}
                          >
                            {getCellText(cell)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            <div>
              <div
                style={{
                  background: "#f4fbff",
                  border: "1px solid #dceffc",
                  borderRadius: 22,
                  padding: 18,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 16,
                    background: "#e3f2fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Crosshair size={30} color="#1568a8" />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    color: "#7aaed0",
                    textTransform: "uppercase",
                  }}
                >
                  Last Result
                </p>

                <motion.h2
                  key={result}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    margin: "6px 0 8px",
                    color:
                      result.includes("Sunk") || result === "Sunk"
                        ? "#0a2e4a"
                        : result.includes("Hit") || result === "Hit"
                        ? "#dc2626"
                        : "#1568a8",
                    fontSize: 32,
                    fontWeight: 900,
                  }}
                >
                  {result}
                </motion.h2>

                <p
                  style={{
                    margin: 0,
                    color: "#5a8aaa",
                    fontSize: 13,
                    lineHeight: 1.45,
                    fontWeight: 600,
                  }}
                >
                  Hit gives another attack. Miss changes the turn.
                </p>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #dceffc",
                  borderRadius: 22,
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#0a2e4a",
                  }}
                >
                  Attacking Board
                </p>

                <p style={{ margin: 0, color: "#5a8aaa", fontSize: 13 }}>
                  Captain {currentPlayer} is attacking Captain {opponent}'s board.
                </p>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #dceffc",
                  borderRadius: 22,
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#0a2e4a",
                  }}
                >
                  Legend
                </p>

                <LegendItem label="Hit" mark="✕" color="#ef4444" />
                <LegendItem label="Miss" mark="○" color="#e8f4fb" textColor="#1568a8" />
                <LegendItem label="Sunk" mark="✕" color="#0a2e4a" textColor="#fff" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LegendItem({ label, mark, color, textColor = "#fff" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: color,
          border: "1px solid #b9dff3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: textColor,
          fontWeight: 900,
        }}
      >
        {mark}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#0a2e4a",
          fontWeight: 700,
        }}
      >
        {label}
      </p>
    </div>
  );
}