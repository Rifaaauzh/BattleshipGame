import { useState } from "react";
import MainScreen from "./screens/MainScreen";
import RulesScreen from "./screens/RulesScreen";
import NameScreen from "./screens/NameScreen";
import PlaceShipScreen from "./screens/PlaceShipScreen";
import AttackScreen from "./screens/AttackScreen";
import GameOverScreen from "./screens/GameOverScreen";

export default function App() {
  const [screen, setScreen] = useState("main");
  const [mode, setMode] = useState(null);
  const [winner, setWinner] = useState(null);
  const [placingPlayer, setPlacingPlayer] = useState(1);

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

  const goToRules = (selectedMode) => {
    setMode(selectedMode);
    setPlacingPlayer(1);
    setWinner(null);
    setScreen("rules");
  };

  const handleStartGame = async () => {
    const response = await fetch("http://localhost:5230/api/game/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode,
        player1Name,
        player2Name,
      }),
    });

    const result = await response.json();

    if (!result.isSuccess) {
      alert(result.message);
      return;
    }

    setPlacingPlayer(1);
    setScreen("placeShip");
  };

  const getPlacingPlayerName = () => {
    if (placingPlayer === 1) {
      return player1Name;
    }

    return player2Name;
  };

  return (
    <>
      {screen === "main" && <MainScreen onSelectMode={goToRules} />}

      {screen === "rules" && (
        <RulesScreen
          mode={mode}
          onBack={() => setScreen("main")}
          onContinue={() => setScreen("name")}
        />
      )}

      {screen === "name" && (
        <NameScreen
          mode={mode}
          player1Name={player1Name}
          setPlayer1Name={setPlayer1Name}
          player2Name={player2Name}
          setPlayer2Name={setPlayer2Name}
          onBack={() => setScreen("rules")}
          onContinue={handleStartGame}
        />
      )}

      {screen === "placeShip" && (
        <PlaceShipScreen
          mode={mode}
          playerNumber={placingPlayer}
          playerName={getPlacingPlayerName()}
          onBack={() => setScreen("name")}
          onDone={async () => {
            if (mode === "bot") {
              const response = await fetch(
                "http://localhost:5230/api/game/auto-place-bot",
                {
                  method: "POST",
                }
              );

              const result = await response.json();

              if (!result.isSuccess) {
                alert(result.message);
                return;
              }

              setScreen("attack");
              return;
            }

            if (placingPlayer === 1) {
              setPlacingPlayer(2);
            } else {
              setScreen("attack");
            }
          }}
        />
      )}

      {screen === "attack" && (
        <AttackScreen
          mode={mode}
          player1Name={player1Name}
          player2Name={mode === "bot" ? "Captain Thoni" : player2Name}
          onGameOver={(winnerName) => {
            setWinner(winnerName);
            setScreen("gameOver");
          }}
        />
      )}

      {screen === "gameOver" && (
        <GameOverScreen
          mode={mode}
          winner={winner}
          onPlayAgain={() => {
            setPlacingPlayer(1);
            setScreen("placeShip");
          }}
          onMainMenu={() => {
            setPlacingPlayer(1);
            setWinner(null);
            setScreen("main");
          }}
        />
      )}
    </>
  );
}