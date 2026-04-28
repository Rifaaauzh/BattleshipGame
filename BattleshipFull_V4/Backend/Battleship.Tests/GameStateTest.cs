using Battleship.Enum;
using Battleship.Models;
using NUnit.Framework;

namespace Battleship.Tests;

[TestFixture]
public class GameStateTests
{
    private Game _game;
    private Player _player1;
    private Player _player2;

    [SetUp]
    public void SetUp()
    {
        _player1 = new Player("Rifa");
        _player2 = new Player("yoyo");

        _game = new Game(_player1, _player2, new Board(10), new Board(10), new List<Ship>(), new List<Ship>(), false);
    }

    //Start Game saat transition to Inprogress nya (see the result and status)
     [Test]
    public void StartGame_AlreadyInProgress_ReturnsFalse()
    {
        // Arrange
        _game.StartGame();

        // Act
        bool result = _game.StartGame();

        // Assert
        Assert.That(result, Is.False, "Game should not start again if already in progress");
    }

    [Test]
    public void EndGame_TransitionToEnd_ReturnsTrue()
    {
        // Act
        bool result = _game.EndGame();

        // Assert
        Assert.That(result, Is.True, "Game should end successfully");
        Assert.That(_game.GetStatus(), Is.EqualTo(GameStatus.End), "Game status should be End after ending");
    }

    [Test]
    public void EndGame_AlreadyEnded_ReturnsFalse()
    {
        // Arrange
        _game.EndGame();

        // Act
        bool result = _game.EndGame();

        // Assert
        Assert.That(result, Is.False, "Game should not end again if already ended");
    }

    [Test]
    public void MakeMove_LastShipSunk_SetsWinner()
    {
        // Arrange
        _game.PlaceShip(_player2, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);
        _game.StartGame();

        // Act
        _game.MakeMove(new Position(0, 0));
        _game.MakeMove(new Position(1, 0));

        // Assert
        Assert.That(_game.GetWinner(), Is.Not.Null, "Winner should be set when all ships are sunk");
        Assert.That(_game.GetWinner(), Is.EqualTo(_player1), "Player 1 should be the winner");
    }

    [Test]
    public void MakeMove_LastShipSunk_ChangesStatusToEnd()
    {
        // Arrange
        _game.PlaceShip(_player2, ShipType.PatrolBoat, new Position(0, 0), Orientation.Horizontal);
        _game.StartGame();

        // Act
        _game.MakeMove(new Position(0, 0));
        _game.MakeMove(new Position(1, 0));

        // Assert
        Assert.That(_game.GetStatus(), Is.EqualTo(GameStatus.End), "Game should end when all ships are sunk");
    }
}