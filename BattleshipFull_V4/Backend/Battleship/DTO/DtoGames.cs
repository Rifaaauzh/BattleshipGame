using Battleship.Enum;
using System.Collections.Generic;

namespace Battleship.DTOs;

// request

public class StartGameRequest
{
    public string Mode { get; set; } = "";
    public string Player1Name { get; set; } = "";
    public string Player2Name { get; set; } = "";
}

public class PlaceShipRequest
{
    public string PlayerName { get; set; } = "";
    public ShipType ShipType { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public Orientation Orientation { get; set; }
}

public class ShootRequest
{
    public int X { get; set; }
    public int Y { get; set; }
}

// response

public class StartGameResponse
{
    public string Player1 { get; set; } = "";
    public string Player2 { get; set; } = "";
    public string CurrentPlayer { get; set; } = "";
}

public class MessageResponse
{
    public string Message { get; set; } = "";
}

public class ShootResponse
{
    public string Result { get; set; } = "";
    public string Message { get; set; } = "";
    public List<string> BotMessages { get; set; } = new();
    public string CurrentPlayer { get; set; } = "";
    public string? Winner { get; set; }
    public string Status { get; set; } = "";
}

public class CellResponse
{
    public int X { get; set; }
    public int Y { get; set; }
    public string State { get; set; } = "";
}

public class BoardResponse
{
    public string CurrentPlayer { get; set; } = "";
    public string Opponent { get; set; } = "";
    public List<CellResponse> PlayerBoard { get; set; } = new();
    public List<CellResponse> EnemyBoard { get; set; } = new();
    public string? Winner { get; set; }
    public string Status { get; set; } = "";
}