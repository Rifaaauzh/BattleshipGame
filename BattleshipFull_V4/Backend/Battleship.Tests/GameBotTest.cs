using Battleship.Enum;
using Battleship.Interfaces;
using Battleship.Models;
using NUnit.Framework;

namespace Battleship.Tests;

[TestFixture]
public class GameBotTests
{
    private Game _game;
    private Player _player1;
    private Player _bot;

    [SetUp]
    public void SetUp()
    {
        _player1 = new Player("Rifa");
        _bot = new Player("Captain Thoni");

        _game = new Game(_player1, _bot, new Board(10), new Board(10), new List<Ship>(), new List<Ship>(), true);
    }

    [Test]
    public void MakeBotMove_WhenNotBotMode_ReturnsFalse()
    {
        Game normalGame = new Game(_player1, _bot, new Board(10), new Board(10), new List<Ship>(), new List<Ship>(), false);

        normalGame.StartGame();

        bool result = normalGame.MakeBotMove();

        Assert.That(result, Is.False, "Bot should not move when bot mode is false");
    }

    [Test]
    public void MakeBotMove_WhenGameNotStarted_ReturnsFalse()
    {
        bool result = _game.MakeBotMove();

        Assert.That(result, Is.False, "Bot should not move before game starts");
    }

    [Test]
    public void AutoPlaceShips_ShouldPlaceAllShips()
    {
        bool result = _game.AutoPlaceShips(_bot);

        IReadOnlyList<IShip> ships = _game.GetShips(_bot);

        int expectedShipCount = System.Enum.GetValues(typeof(ShipType)).Length;

        Assert.That(result, Is.True, "Auto place should succeed");
        Assert.That(ships.Count, Is.EqualTo(expectedShipCount), "Bot should place all ship types");
    }

    [Test]
    public void AutoPlaceShips_WhenGameInProgress_ReturnsFalse()
    {
        _game.StartGame();

        bool result = _game.AutoPlaceShips(_bot);

        Assert.That(result, Is.False, "Bot should not auto-place ships after game starts");
    }
    [Test]
    public void MakeBotMove_WhenBotTurn_ShouldUseRandomAttackPosition()
    {
        _game.StartGame();

        // Player 1 miss, so turn switches to bot
        _game.MakeMove(new Position(0, 0));

        bool result = _game.MakeBotMove();

        Assert.That(result, Is.True, "Bot should make a move using random attack position");
    }
}