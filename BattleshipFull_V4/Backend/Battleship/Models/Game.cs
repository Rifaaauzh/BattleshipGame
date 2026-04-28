using Battleship.Enum;
using Battleship.Interfaces;
namespace Battleship.Models;

public class Game
{
    private Player _currentPlayer;
    private Player? _winner;
    private GameStatus _status;
    private bool _isBotMode;

    // untuk bot pilih cell dan attack secara acak
    private Random _random;

    private Dictionary<Player, Board> _playerBoards;
    private Dictionary<Player, List<Ship>> _playerShips;

    public event Action<IShip>? OnShipSunk;

    public Game(Player player1, Player player2, Board player1Board, Board player2Board, List<Ship> player1Ships, List<Ship> player2Ships, bool isBotMode)
    {
        _currentPlayer = player1;
        _winner = null;
        _status = GameStatus.Setup;

        _isBotMode = isBotMode;
        _random = new Random();

        _playerBoards = new Dictionary<Player, Board>
        {
            { player1, player1Board },
            { player2, player2Board }
        };

        _playerShips = new Dictionary<Player, List<Ship>>
        {
            { player1, player1Ships },
            { player2, player2Ships }
        };
    }

    public bool StartGame()
    {
        if (_status != GameStatus.Setup) 
        {
            return false;
        }

        _status = GameStatus.InProgress;
        
        return true;
    }

    public bool PlaceShip(IPlayer player, ShipType shipType, Position position, Orientation orientation)
    {
        if (_status != GameStatus.Setup)
        {
            return false;
        }

        Player currentPlayer = (Player)player;
        Board board = _playerBoards[currentPlayer];
        Ship ship = new Ship(shipType, position, orientation);

        if (!ValidatePlacement(currentPlayer, ship))
        {
            return false;
        }

        PlaceShipOnBoard(board, ship);
        _playerShips[currentPlayer].Add(ship);

        return true;
    }
    
    public bool MakeMove(Position position)
    {
        if (_status != GameStatus.InProgress)
        {
            return false;
        }

        if (!ValidateAttack(position))
        {
            return false;
        }

        Player opponent = (Player)GetOpponent();
        Board opponentBoard = _playerBoards[opponent];
        Cell targetCell = (Cell)opponentBoard.GetCell(position);

        bool isHit = targetCell.Ship != null;

        if (isHit)
        {
            targetCell.State = CellState.Hit;

            Ship hitShip = (Ship)targetCell.Ship!;
            hitShip.Hits++;

            CheckShipSunk(hitShip);
        }
        else
        {
            targetCell.State = CellState.Miss;
        }


        bool hasWinner = CheckWinner();

        if (!hasWinner && !isHit)
        {
            SwitchTurn();
        }

        return true;
    }
    private Position GetShipPosition(Position start, Orientation orientation, int i)
    {
        int x = orientation == Orientation.Horizontal ? start.X + i : start.X;
        int y = orientation == Orientation.Vertical ? start.Y + i : start.Y;

        return new Position(x, y);
    }
    private void PlaceShipOnBoard(Board board, Ship ship)
    {
        for (int i = 0; i < ship.Size; i++)
        {
            Position shipPosition = GetShipPosition(ship.Position, ship.Orientation, i);

            Cell cell = (Cell)board.GetCell(shipPosition);
            cell.Ship = ship;
            cell.State = CellState.Occupied;
        }
    }
    public bool EndGame()
    {
        if (_status == GameStatus.End)
            return false;

        _status = GameStatus.End;

        return true;
    }

    public GameStatus GetStatus()
    {
        return _status;
    }

    public IPlayer? GetWinner()
    {
        return _winner;
    }

    public IPlayer GetCurrentPlayer()
    {
        return _currentPlayer;
    }

    public IPlayer GetOpponent()
    {
        return _playerBoards.Keys.First(player => player != _currentPlayer);
    }

    public IBoard GetBoard(IPlayer player)
    {
        return _playerBoards[(Player)player];
    }
    

    public IReadOnlyList<IShip> GetShips(IPlayer player)
    {
        return _playerShips[(Player)player];
    }
    
    private bool IsInsideBoard(Position position)
    {
        int size = _playerBoards.Values.First().Size;

        if (position.X < 0 || position.X >= size || position.Y < 0 || position.Y >= size)
        {
            return false;
        }

        return true;
    }

   private bool IsCellOccupied(Board board, Position position)
    {
        ICell cell = board.GetCell(position);

        if (cell.Ship != null)
        {
            return true;
        }

        return false;
    }

    private bool ValidatePlacement(Player player, Ship ship)
    {
        Board board = _playerBoards[player];

        for (int i = 0; i < ship.Size; i++)
        {
            Position position = GetShipPosition(ship.Position, ship.Orientation, i);

            if (!IsInsideBoard(position) || IsCellOccupied(board, position))
            {
                return false;
            }
        }

        return true;
    }

    private bool ValidateAttack(Position position)
    {
        if (!IsInsideBoard(position))
        {
            return false;
        }

        Player opponent = (Player)GetOpponent();
        Board board = _playerBoards[opponent];

        ICell cell = board.GetCell(position);

        if (cell.State == CellState.Hit || cell.State == CellState.Miss)
        {
            return false;
        }

        return true;
    }

    private bool CheckShipSunk(IShip ship)
    {
        if (ship.Hits >= ship.Size)
        {
            OnShipSunk?.Invoke(ship);
            return true;
        }

        return false;
    }

   private bool CheckWinner()
{
    Player opponent = (Player)GetOpponent();

    if (_playerShips[opponent].Count == 0)
    {
        return false;
    }

    bool allShipsSunk = _playerShips[opponent].All(ship => ship.Hits >= ship.Size);

    if (allShipsSunk)
    {
        _winner = _currentPlayer;
        EndGame();

        return true;
    }

    return false;
}


    private void SwitchTurn()
    {   
        _currentPlayer = _playerBoards.Keys
            .First(p => p != _currentPlayer);
    }
    public bool MakeBotMove()
    {
        if (!_isBotMode)
        {
            return false;
        }
        if (_status != GameStatus.InProgress)
        {
            return false;
        }

        Position position = GetRandomAttackPosition();

        
        return MakeMove(position);
    }
    // Method ini generate posisi attack secara random
    private Position GetRandomAttackPosition()
    {
        // ambil opponent (yang akan diserang bot)
        Player opponent = (Player)GetOpponent();

        // ambil board opponent
        Board opponentBoard = _playerBoards[opponent];

        int boardSize = opponentBoard.Size;

        // loop sampai ketemu cell yang valid
        while (true)
        {
            // generate koordinat random
            int x = _random.Next(0, boardSize);
            int y = _random.Next(0, boardSize);

            Position position = new Position(x, y);

            // ambil cell di posisi tersebut
            Cell cell = (Cell)opponentBoard.GetCell(position);

            // kalau cell belum pernah di-hit/miss ya valid artinya kan
            if (cell.State != CellState.Hit && cell.State != CellState.Miss)
            {
                return position;
            }
        }
    }
    public bool AutoPlaceShips(IPlayer player)
    {
        if (_status != GameStatus.Setup)
        {
            return false;
        }

        Player currentPlayer = (Player)player;

        foreach (ShipType shipType in System.Enum.GetValues(typeof(ShipType)))
        {
            bool placed = false;

            while (!placed)
            {
                int x = _random.Next(0, 10);
                int y = _random.Next(0, 10);

                Orientation orientation;

                if (_random.Next(0, 2) == 0)
                {
                    orientation = Orientation.Horizontal;
                }
                else
                {
                    orientation = Orientation.Vertical;
                }

                Position position = new Position(x, y);

                placed = PlaceShip( currentPlayer, shipType, position, orientation);
            }
        }

        return true;
    }
}