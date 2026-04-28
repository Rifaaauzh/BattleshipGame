using System;
using System.Collections.Generic;

public class GameController
{
    private int _currentPlayerIndex;
    private GameStatus _status;

    private Player[] _players;
    private Dictionary<Player, Board> _playerBoards;
    private Dictionary<Player, List<Ship>> _playerShips;

    // =========================
    // EVENTS (UI)
    // =========================
    public event Action<Player> OnTurnChanged;
    public event Action<Position, CellState> OnMoveProcessed;
    public event Action<ShipType> OnShipSunk;
    public event Action<Player> OnGameOver;

    // =========================
    // START GAME
    // =========================
    public void StartGame(Player p1, Player p2, int boardSize)
    {
        _status = GameStatus.SETUP;

        _players = new Player[] { p1, p2 };

        _playerBoards = new Dictionary<Player, Board>();
        _playerShips = new Dictionary<Player, List<Ship>>();

        foreach (var p in _players)
        {
            _playerBoards[p] = new Board(boardSize);
            _playerShips[p] = new List<Ship>();
        }

        _currentPlayerIndex = 0;
        OnTurnChanged?.Invoke(GetCurrentPlayer());
    }

    // =========================
    // PLACE SHIP
    // =========================
    public bool PlaceShip(Player p, ShipType type, Position pos, Orientation orient)
    {
        if (_status != GameStatus.SETUP)
            return false;

        if (!ValidatePlacement(p, type, pos, orient))
            return false;

        Ship ship = new Ship(type, orient);

        _playerShips[p].Add(ship);

        _playerBoards[p].PlaceShip(ship, pos);

        return true;
    }

    // =========================
    // MAKE MOVE
    // =========================
    public bool MakeMove(Position pos)
    {
        if (_status != GameStatus.IN_PROGRESS)
            return false;

        Player attacker = GetCurrentPlayer();
        Player target = GetOpponent();

        if (!ValidateAttack(attacker, pos))
            return false;

        CellState result = ApplyAttack(target, pos);

        OnMoveProcessed?.Invoke(pos, result);

        UpdateShipStatus(target);

        if (CheckWin())
        {
            EndGame();
            OnGameOver?.Invoke(attacker);
            return true;
        }

        if (result == CellState.MISS)
        {
            SwitchTurn();
        }

        return true;
    }

    // =========================
    // END GAME
    // =========================
    public void EndGame()
    {
        _status = GameStatus.FINISHED;
    }

    // =========================
    // TURN HELPERS
    // =========================
    public Player GetCurrentPlayer()
    {
        return _players[_currentPlayerIndex];
    }

    public Player GetOpponent()
    {
        return _players[1 - _currentPlayerIndex];
    }

    private void SwitchTurn()
    {
        _currentPlayerIndex = 1 - _currentPlayerIndex;
        OnTurnChanged?.Invoke(GetCurrentPlayer());
    }

    // =========================
    // VALIDATION
    // =========================
    private bool ValidatePlacement(Player p, ShipType type, Position pos, Orientation orient)
    {
        Board board = _playerBoards[p];

        return board.CanPlaceShip(type, pos, orient);
    }

    private bool ValidateAttack(Player p, Position pos)
    {
        Board board = _playerBoards[GetOpponent()];

        return board.IsValidAttack(pos);
    }

    // =========================
    // ATTACK PROCESS
    // =========================
    private CellState ApplyAttack(Player target, Position pos)
    {
        Board board = _playerBoards[target];

        return board.ReceiveAttack(pos);
    }

    // =========================
    // SHIP STATUS
    // =========================
    private void UpdateShipStatus(Player p)
    {
        foreach (var ship in _playerShips[p])
        {
            if (ship.IsSunk())
                OnShipSunk?.Invoke(ship.Type);
        }
    }

    // =========================
    // WIN CHECK
    // =========================
    private bool CheckWin()
    {
        Player opponent = GetOpponent();

        foreach (var ship in _playerShips[opponent])
        {
            if (!ship.IsSunk())
                return false;
        }

        return true;
    }
}

public class Player
{
    public string Name;

    public Player(string name)
    {
        Name = name;
    }
}

public class Board
{
    public int Size;
    public Cell[,] Cells;

    public Board(int size)
    {
        Size = size;
        Cells = new Cell[size, size];

        for (int i = 0; i < size; i++)
        {
            for (int j = 0; j < size; j++)
            {
                Cells[i, j] = new Cell(new Position(i, j));
            }
        }
    }

    public void PlaceShip(Ship ship, Position pos)
    {
        Cells[pos.X, pos.Y].Ship = ship;
        Cells[pos.X, pos.Y].State = CellState.OCCUPIED;
    }

    public bool CanPlaceShip(ShipType type, Position pos, Orientation orient)
    {
        return true; // simplified
    }

    public bool IsValidAttack(Position pos)
    {
        return true; // simplified
    }

    public CellState ReceiveAttack(Position pos)
    {
        Cell cell = Cells[pos.X, pos.Y];

        if (cell.Ship != null)
        {
            cell.State = CellState.HIT;
            cell.Ship.Hits++;
            return CellState.HIT;
        }

        cell.State = CellState.MISS;
        return CellState.MISS;
    }
}

public class Cell
{
    public Position Position;
    public CellState State;
    public Ship Ship;

    public Cell(Position pos)
    {
        Position = pos;
        State = CellState.EMPTY;
    }
}
public struct Position
{
    public int X;
    public int Y;

    public Position(int x, int y)
    {
        X = x;
        Y = y;
    }
}

public class Ship
{
    public ShipType Type;
    public int Hits;
    public Orientation Orientation;

    public Ship(ShipType type, Orientation orientation)
    {
        Type = type;
        Orientation = orientation;
        Hits = 0;
    }

    public bool IsSunk()
    {
        return Hits >= 1; // simplified
    }
}

public enum CellState
{
    EMPTY,
    OCCUPIED,
    HIT,
    MISS
}

public enum Orientation
{
    HORIZONTAL,
    VERTICAL
}

public enum GameStatus
{
    SETUP,
    IN_PROGRESS,
    FINISHED
}

public enum ShipType
{
    Carrier,
    Battleship,
    Cruiser,
    Submarine,
    Patrol_boat
}


