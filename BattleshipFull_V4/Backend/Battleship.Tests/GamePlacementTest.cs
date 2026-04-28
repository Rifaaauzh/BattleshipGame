using System.Reflection;
using Battleship.Enum;
using Battleship.Models;
using NUnit.Framework;

namespace Battleship.Tests;

[TestFixture]
public class GamePlacementTests
{
    private Game _game;
    private Player _player1;
    private Player _player2;

    [SetUp]
    public void SetUp()
    {
        _player1 = new Player("Rifa");
        _player2 = new Player("Bot");

        _game = new Game(_player1, _player2, new Board(10), new Board(10), new List<Ship>(), new List<Ship>(), false);
    }

    [Test]
    public void PlaceShip_ValidPlacement_ReturnsTrue()
    {
        bool result = _game.PlaceShip(_player1, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);

        Assert.That(result, Is.True, "Valid placement should succeed");
        Assert.That(_game.GetShips(_player1).Count, Is.EqualTo(1), "Ship should be added to player");
    }

    [TestCase(10, 0)]
    [TestCase(20, 20)]
    public void PlaceShip_OutOfBounds_ReturnsFalse(int x, int y)
    {
        bool result = _game.PlaceShip(_player1, ShipType.PatrolBoat, new Position(x, y), Orientation.Horizontal);

        Assert.That(result, Is.False, $"Position {x} and {y} harusnya invalid");
    }

    [Test]
    public void PlaceShip_Overlap_ReturnsFalse()
    {
        _game.PlaceShip( _player1, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);

        bool result = _game.PlaceShip( _player1, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);

        Assert.That(result, Is.False, "Should not allow overlapping ships nya");
    }

    [Test]
    public void PlaceShip_WhenGameInProgress_ReturnsFalse()
    {
        _game.StartGame();

        bool result = _game.PlaceShip(_player1, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);

        Assert.That(result, Is.False, "Should not allow placing ships after game starts");
    }

    [Test]
    public void PlaceShip_VerticalPlacement_ReturnsTrue()
    {
        bool result = _game.PlaceShip( _player1, ShipType.PatrolBoat, new Position(0, 0), Orientation.Vertical);

        Assert.That(result, Is.True, "Vertical placement should succeed");
    }
    [Test]
    public void PlaceShip_HorizontalPlacement_ReturnFalse()
    {
        bool result = _game.PlaceShip(_player1, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);
        Assert.That(result, Is.True, "Horizontal placement should succeed");
    }
}