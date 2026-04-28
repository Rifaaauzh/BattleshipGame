using Battleship.DTOs;
using Battleship.Enum;
using Battleship.Interfaces;
using Battleship.Models;

namespace Battleship.Services;

public class GameService
{
    private Game? _game;
    private Player? _player1;
    private Player? _player2;
    private string? _lastSunkShip;

    public ServiceResult<StartGameResponse> StartGame(StartGameRequest request)
    {
        bool isBotMode = request.Mode == "bot";

        Player player1 = new Player(request.Player1Name);

        Player player2;
        if (isBotMode)
        {
            player2 = new Player("Captain Thoni");
        }
        else
        {
            player2 = new Player(request.Player2Name);
        }

        _player1 = player1;
        _player2 = player2;

        Board board1 = new Board(10);
        Board board2 = new Board(10);

        List<Ship> ships1 = new List<Ship>();
        List<Ship> ships2 = new List<Ship>();

        _game = new Game(player1, player2, board1, board2, ships1, ships2, isBotMode );

        _game.OnShipSunk += ship =>
        {
            _lastSunkShip = ship.ShipType.ToString();
        };

        StartGameResponse response = new StartGameResponse();

        response.Player1 = player1.Name;
        response.Player2 = player2.Name;
        response.CurrentPlayer = _game.GetCurrentPlayer().Name;

        return ServiceResult<StartGameResponse>.Success(response, "Game created successfully.");
    }

    public ServiceResult<MessageResponse> PlaceShip(PlaceShipRequest request)
    {
        if (_game == null)
        {
            return ServiceResult<MessageResponse>.Failure("Game not started.");
        }

        Player? player = GetPlayerByName(request.PlayerName);

        if (player == null)
        {
            return ServiceResult<MessageResponse>.Failure("Player not found.");
        }

        Position position = new Position(request.X, request.Y);

        bool success = _game.PlaceShip(
            player,
            request.ShipType,
            position,
            request.Orientation
        );

        if (!success)
        {
            return ServiceResult<MessageResponse>.Failure("Invalid ship placement.");
        }

        MessageResponse response = new MessageResponse();

        response.Message = $"{request.ShipType} placed successfully";

        return ServiceResult<MessageResponse>.Success(response, response.Message);
    }

    public ServiceResult<ShootResponse> Shoot(ShootRequest request)
    {
        if (_game == null)
        {
            return ServiceResult<ShootResponse>.Failure("Game not started.");
        }

        if (_game.GetStatus() == GameStatus.Setup)
        {
            bool started = _game.StartGame();

            if (!started)
            {
                return ServiceResult<ShootResponse>.Failure("Game could not be started.");
            }
        }

        _lastSunkShip = null;

        IPlayer attackerBeforeMove = _game.GetCurrentPlayer();

        Position position = new Position(request.X, request.Y);

        bool success = _game.MakeMove(position);

        if (!success)
        {
            return ServiceResult<ShootResponse>.Failure("Invalid move.");
        }

        bool isHit = _game.GetCurrentPlayer().Name == attackerBeforeMove.Name;

        string result;
        string message;

        if (_game.GetWinner() != null)
        {
            result = "win";
            message = $"Captain {_game.GetWinner()!.Name} wins!";
        }
        else if (_lastSunkShip != null)
        {
            IPlayer opponent = _game.GetOpponent();

            result = "sunk";
            message = $"Captain {attackerBeforeMove.Name} sunk {_lastSunkShip} of Captain {opponent.Name}!";
        }
        else if (isHit)
        {
            result = "hit";
            message = $"Captain {attackerBeforeMove.Name} hit a ship!";
        }
        else
        {
            result = "miss";
            message = $"Captain {attackerBeforeMove.Name} missed.";
        }

        List<string> botMessages = new List<string>();

        while (
            _game.GetStatus() == GameStatus.InProgress &&
            _game.GetCurrentPlayer().Name == "Captain Thoni"
        )
        {
            IPlayer botBeforeMove = _game.GetCurrentPlayer();

            bool botSuccess = _game.MakeBotMove();

            if (!botSuccess)
            {
                break;
            }

            if (_game.GetWinner() != null)
            {
                botMessages.Add("Captain Thoni wins!");
                break;
            }

            bool botHit = _game.GetCurrentPlayer().Name == botBeforeMove.Name;

            if (botHit)
            {
                botMessages.Add("hit");
            }
            else
            {
                botMessages.Add("miss");
            }
        }

        ShootResponse response = new ShootResponse();

        response.Result = result;
        response.Message = message;
        response.BotMessages = botMessages;
        response.CurrentPlayer = _game.GetCurrentPlayer().Name;
        response.Winner = _game.GetWinner()?.Name;
        response.Status = _game.GetStatus().ToString();

        return ServiceResult<ShootResponse>.Success(response, message);
    }

    public ServiceResult<BoardResponse> GetBoard()
    {
        if (_game == null)
        {
            return ServiceResult<BoardResponse>.Failure("Game not started.");
        }

        IPlayer currentPlayer = _game.GetCurrentPlayer();
        IPlayer opponent = _game.GetOpponent();

        IBoard playerBoard = _game.GetBoard(currentPlayer);
        IBoard enemyBoard = _game.GetBoard(opponent);

        BoardResponse response = new BoardResponse();

        response.CurrentPlayer = currentPlayer.Name;
        response.Opponent = opponent.Name;
        response.PlayerBoard = ConvertBoard(playerBoard, false);
        response.EnemyBoard = ConvertBoard(enemyBoard, true);
        response.Winner = _game.GetWinner()?.Name;
        response.Status = _game.GetStatus().ToString();

        return ServiceResult<BoardResponse>.Success(response, "Board loaded successfully.");
    }

    public ServiceResult<MessageResponse> AutoPlaceBot()
    {
        if (_game == null || _player2 == null)
        {
            return ServiceResult<MessageResponse>.Failure("Game not started.");
        }

        bool success = _game.AutoPlaceShips(_player2);

        if (!success)
        {
            return ServiceResult<MessageResponse>.Failure("Could not auto-place bot ships.");
        }

        MessageResponse response = new MessageResponse();

        response.Message = "Captain Thoni placed all ships.";

        return ServiceResult<MessageResponse>.Success(response, response.Message);
    }

    private Player? GetPlayerByName(string playerName)
    {
        if (_player1 != null && _player1.Name == playerName)
        {
            return _player1;
        }

        if (_player2 != null && _player2.Name == playerName)
        {
            return _player2;
        }

        return null;
    }

    private List<CellResponse> ConvertBoard(IBoard board, bool hideShips)
    {
        List<CellResponse> cells = new List<CellResponse>();

        for (int y = 0; y < board.Size; y++)
        {
            for (int x = 0; x < board.Size; x++)
            {
                ICell cell = board.GetCell(new Position(x, y));

                string state = "empty";

                if (cell.State == CellState.Hit)
                {
                    if (cell.Ship != null && cell.Ship.Hits >= cell.Ship.Size)
                    {
                        state = "sunk";
                    }
                    else
                    {
                        state = "hit";
                    }
                }
                else if (cell.State == CellState.Miss)
                {
                    state = "miss";
                }
                else if (!hideShips && cell.Ship != null)
                {
                    state = "ship";
                }

                CellResponse cellResponse = new CellResponse();

                cellResponse.X = x;
                cellResponse.Y = y;
                cellResponse.State = state;

                cells.Add(cellResponse);
            }
        }

        return cells;
    }
}