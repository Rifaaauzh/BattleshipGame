using Battleship.Enum;
using Battleship.Models;
using Battleship.Interfaces;
using NUnit.Framework;
using System.Runtime.CompilerServices;

namespace Battleship.Tests;

// yang harus ada: 
//belum start (Dah)
//koordinat invalid(dah)
// miss (dah)
// hit (dah)
// cell state berubah(Dah)
//ship hits naik (dah)
//turn pindah saat miss(dah)
// turn tetap saat hit(dah)
// tidak boleh attack koordinat sama (dah)

[TestFixture]
public class GameAttackTests
{
    private Game _game;
    private Player _player1;
    private Player _player2;

    [SetUp]
    public void SetUp()
    {
        _player1 = new Player("Rifa");
        _player2 = new Player("Bot");

        _game = new Game( _player1, _player2, new Board(10), new Board(10), new List<Ship>(), new List<Ship>(), false);
    }

    [Test]
    public void MakeMove_WhenGameNotStarted_ReturnsFalse()
    {
        bool result = _game.MakeMove(new Position(0, 0));

        Assert.That(result, Is.False, "Should not allow attacking before game starts");
    }

    [TestCase(15, 15)]
    [TestCase(-1, 0)]
    public void MakeMove_InvalidCoordinate_ReturnsFalse(int x, int y)
    {
        _game.StartGame();

        bool result = _game.MakeMove(new Position(15, 15));

        Assert.That(result, Is.False, $"Attack in {x} and {y} should be invalid");
    }

    [Test]
    public void MakeMove_ValidMiss_UpdatesCellState()
    {
        _game.StartGame();

        bool result = _game.MakeMove(new Position(0, 0));

        IBoard board = _game.GetBoard(_player2);
        ICell cell = board.GetCell(new Position(0, 0));

        Assert.That(result, Is.True, "Valid miss should return true");
        Assert.That(cell.State, Is.EqualTo(CellState.Miss), "Missed cell should be marked as Miss");
    }

    [Test]
    public void MakeMove_SwitchTurnOnMiss_SetsCorrectPlayer()
    {
        _game.StartGame();

        IPlayer playerBeforeMove = _game.GetCurrentPlayer();

        _game.MakeMove(new Position(0, 0));

        Assert.That(_game.GetCurrentPlayer(), Is.Not.EqualTo(playerBeforeMove), "Turn should switch after miss");
        Assert.That(_game.GetCurrentPlayer(), Is.EqualTo(_player2), "Current player should be player 2 after player 1 misses");
    }

    [Test]
    public void MakeMove_ValidHit_UpdatesCellState()
    {
        _game.PlaceShip(_player2, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);

        _game.StartGame();

        bool result = _game.MakeMove(new Position(0, 0));

        IBoard board = _game.GetBoard(_player2);
        ICell cell = board.GetCell(new Position(0, 0));

        Assert.That(result, Is.True, "Valid hit should return true");
        Assert.That(cell.State, Is.EqualTo(CellState.Hit), "Hit cell should be marked as Hit");
    }

    [Test]
    public void MakeMove_ValidHit_IncrementsShipHits()
    {
        _game.PlaceShip(_player2, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);

        _game.StartGame();

        _game.MakeMove(new Position(0, 0));

        IReadOnlyList<IShip> ships = _game.GetShips(_player2);

        Assert.That(ships[0].Hits, Is.EqualTo(1), "Ship hit count should increase after being hit");
    }

    [Test]
    public void MakeMove_NoSwitchTurnOnHit_KeepsPlayer()
    {
        _game.PlaceShip( _player2, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);

        _game.StartGame();

        IPlayer playerBeforeMove = _game.GetCurrentPlayer();

        _game.MakeMove(new Position(0, 0));

        Assert.That(_game.GetCurrentPlayer(), Is.EqualTo(playerBeforeMove), "Turn should not switch after hit");
    }

    [Test]
    public void MakeMove_SameCoordinate_ReturnsFalse()
    {
        _game.PlaceShip(_player2, ShipType.PatrolBoat, new Position(0,0), Orientation.Horizontal);
        _game.StartGame();
         
        
        _game.MakeMove(new Position(0, 0));

        bool result = _game.MakeMove(new Position(0, 0));

        Assert.That(result, Is.False, "Should not allow attacking the same coordinate twice");
    }
}

