import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Ship } from "lucide-react";
import bg from "../assets/bg.svg";

const BOARD_SIZE = 10;

const SHIPS = [
  { id: "carrier", name: "Carrier", subtitle: "Kapal Induk", size: 5 },
  { id: "battleship", name: "Battleship", subtitle: "Kapal Perang", size: 4 },
  { id: "cruiser", name: "Cruiser", subtitle: "Kapal Penjelajah", size: 3 },
  { id: "submarine", name: "Submarine", subtitle: "Kapal Selam", size: 3 },
  { id: "destroyer", name: "Destroyer", subtitle: "Kapal Perusak", size: 2 },
];

const SHIP_TYPE_MAP = {
  carrier: "Carrier",
  battleship: "Battleship",
  cruiser: "Cruiser",
  submarine: "Destroyer",
  destroyer: "PatrolBoat",
};

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

export default function PlaceShipScreen({
  mode,
  playerNumber = 1,
  playerName,
  onBack,
  onDone,
}) {
  const [board, setBoard] = useState(createEmptyBoard);
  const [selectedShipId, setSelectedShipId] = useState("carrier");
  const [direction, setDirection] = useState("horizontal");
  const [placedShips, setPlacedShips] = useState([]);
  const [message, setMessage] = useState("Select a ship, then click the board.");
  const [hoverCell, setHoverCell] = useState(null);

  const selectedShip = SHIPS.find((ship) => ship.id === selectedShipId);
  const isBot = mode === "bot";
  const allShipsPlaced = placedShips.length === SHIPS.length;

  useEffect(() => {
    setBoard(createEmptyBoard());
    setSelectedShipId("carrier");
    setDirection("horizontal");
    setPlacedShips([]);
    setHoverCell(null);
    setMessage(`Captain ${playerName || `Player ${playerNumber}`}, place your fleet.`);
  }, [playerNumber, playerName]);

  const title = isBot
    ? `Captain ${playerName}, Place Your Ships`
    : `Captain ${playerName || `Player ${playerNumber}`}, Place Your Ships`;

  function getShipCells(row, col, ship = selectedShip) {
    if (!ship) return [];

    return Array.from({ length: ship.size }, (_, i) => ({
      row: direction === "vertical" ? row + i : row,
      col: direction === "horizontal" ? col + i : col,
    }));
  }

  function canPlaceShip(row, col, ship = selectedShip) {
    if (!ship) return false;

    const cells = getShipCells(row, col, ship);

    return cells.every(({ row, col }) => {
      const insideBoard =
        row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

      return insideBoard && board[row][col] === null;
    });
  }

  async function placeShip(row, col) {
    if (!selectedShip) return;

    if (placedShips.includes(selectedShip.id)) {
      setMessage(`${selectedShip.name} has already been placed.`);
      return;
    }

    if (!canPlaceShip(row, col)) {
      setMessage("You cannot place a ship there.");
      return;
    }

    const newBoard = board.map((boardRow) => [...boardRow]);
    const cells = getShipCells(row, col);

    cells.forEach(({ row, col }) => {
      newBoard[row][col] = selectedShip.id;
    });

    try {
      const response = await fetch("http://localhost:5230/api/game/place-ship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName,
          shipType: SHIP_TYPE_MAP[selectedShip.id],
          x: col,
          y: row,
          orientation: direction === "horizontal" ? "Horizontal" : "Vertical",
        }),
      });

      const result = await response.json();

      if (!result.isSuccess) {
        setMessage(result.message);
        return;
      }
    } catch (error) {
      setMessage("Could not connect to backend.");
      return;
    }

    const newPlacedShips = [...placedShips, selectedShip.id];

    setBoard(newBoard);
    setPlacedShips(newPlacedShips);
    setMessage(`${selectedShip.name} placed successfully.`);

    const nextShip = SHIPS.find((ship) => !newPlacedShips.includes(ship.id));

    if (nextShip) {
      setSelectedShipId(nextShip.id);
    } else {
      setMessage("All ships placed. Ready for battle!");
    }
  }

  function resetBoard() {
    setBoard(createEmptyBoard());
    setSelectedShipId("carrier");
    setDirection("horizontal");
    setPlacedShips([]);
    setHoverCell(null);
    setMessage("Board reset. Place your ships again.");
  }

  function getShipColor(shipId) {
    if (shipId === "carrier") return "#0a2e4a";
    if (shipId === "battleship") return "#124f7a";
    if (shipId === "cruiser") return "#1568a8";
    if (shipId === "submarine") return "#2e8fc4";
    if (shipId === "destroyer") return "#7aaed0";
    return "#f8fdff";
  }

  function isPreviewCell(row, col) {
    if (!hoverCell || !selectedShip || placedShips.includes(selectedShip.id)) {
      return false;
    }

    return getShipCells(hoverCell.row, hoverCell.col).some(
      (cell) => cell.row === row && cell.col === col
    );
  }

  function isPreviewValid() {
    if (!hoverCell || !selectedShip) return false;
    return canPlaceShip(hoverCell.row, hoverCell.col);
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
            maxWidth: 1100,
            background: "rgba(255,255,255,0.96)",
            borderRadius: 28,
            padding: 26,
            boxShadow: "0 12px 36px rgba(0,0,0,0.24)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: "#1568a8",
                margin: "0 0 6px",
              }}
            >
              Prepare the Fleet
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
              {title}
            </h1>

            <p
              style={{
                color: "#5a8aaa",
                fontSize: 14,
                margin: "8px 0 0",
                fontWeight: 700,
              }}
            >
              {message}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 330px",
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
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const preview = isPreviewCell(rowIndex, colIndex);
                    const previewValid = isPreviewValid();

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onMouseEnter={() =>
                          setHoverCell({ row: rowIndex, col: colIndex })
                        }
                        onMouseLeave={() => setHoverCell(null)}
                        onClick={() => placeShip(rowIndex, colIndex)}
                        style={{
                          aspectRatio: "1 / 1",
                          border: preview
                            ? previewValid
                              ? "2px solid #22c55e"
                              : "2px solid #ef4444"
                            : "1px solid #b9dff3",
                          borderRadius: 8,
                          background: cell
                            ? getShipColor(cell)
                            : preview
                            ? previewValid
                              ? "#bbf7d0"
                              : "#fecaca"
                            : "#f8fdff",
                          cursor: "pointer",
                          color: "#fff",
                          fontWeight: 900,
                        }}
                      >
                        {cell ? "■" : preview ? "•" : ""}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <div
                style={{
                  background: "#f4fbff",
                  border: "1px solid #dceffc",
                  borderRadius: 22,
                  padding: 16,
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px",
                    fontWeight: 900,
                    color: "#0a2e4a",
                  }}
                >
                  Select Ship
                </p>

                <div style={{ display: "grid", gap: 10 }}>
                  {SHIPS.map((ship) => {
                    const isSelected = selectedShipId === ship.id;
                    const isPlaced = placedShips.includes(ship.id);

                    return (
                      <button
                        key={ship.id}
                        onClick={() => {
                          if (isPlaced) {
                            setMessage(`${ship.name} has already been placed.`);
                            return;
                          }

                          setSelectedShipId(ship.id);
                          setMessage(`${ship.name} selected.`);
                        }}
                        style={{
                          border: isSelected
                            ? "2px solid #1568a8"
                            : "1px solid #d7edf8",
                          background: isPlaced ? "#eef3f6" : "#fff",
                          borderRadius: 16,
                          padding: 12,
                          cursor: "pointer",
                          opacity: isPlaced ? 0.55 : 1,
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Ship size={20} color={getShipColor(ship.id)} />

                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 900,
                                color: "#0a2e4a",
                              }}
                            >
                              {ship.name}
                            </p>

                            <p
                              style={{
                                margin: "2px 0 0",
                                fontSize: 12,
                                color: "#5a8aaa",
                              }}
                            >
                              {ship.subtitle} • {ship.size} kotak
                            </p>
                          </div>

                          <span
                            style={{
                              fontSize: 12,
                              color: "#1568a8",
                              fontWeight: 900,
                            }}
                          >
                            {isPlaced ? "Placed" : `${ship.size}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <button
                  onClick={() => {
                    setDirection("horizontal");
                    setMessage("Ship will be placed left to right.");
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    border:
                      direction === "horizontal"
                        ? "2px solid #1568a8"
                        : "1px solid #d7edf8",
                    background: direction === "horizontal" ? "#e8f4fb" : "#fff",
                    color: "#0a2e4a",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 12, marginTop: 4 }}>Left to Right</div>
                </button>

                <button
                  onClick={() => {
                    setDirection("vertical");
                    setMessage("Ship will be placed top to bottom.");
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    border:
                      direction === "vertical"
                        ? "2px solid #1568a8"
                        : "1px solid #d7edf8",
                    background: direction === "vertical" ? "#e8f4fb" : "#fff",
                    color: "#0a2e4a",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 12, marginTop: 4 }}>Top to Bottom</div>
                </button>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={onBack}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 14,
                    border: "none",
                    background: "#e8f4fb",
                    color: "#1568a8",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  onClick={onDone}
                  disabled={!allShipsPlaced}
                  style={{
                    flex: 1.3,
                    padding: 13,
                    borderRadius: 14,
                    border: "none",
                    background: allShipsPlaced ? "#1568a8" : "#aacddd",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: allShipsPlaced ? "pointer" : "not-allowed",
                    boxShadow: allShipsPlaced ? "0 5px 0 #0f5590" : "none",
                  }}
                >
                  Done <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}