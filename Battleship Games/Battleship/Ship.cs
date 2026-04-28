public class Ship
{
    private ShipType _type;
    private int _size;
    private int _hits;
    private Orientation _orientation;

    // Constructor
    public Ship(ShipType type, Orientation orientation)
    {
        _type = type;
        _orientation = orientation;
        _hits = 0;

        // Set size based on type
        switch (type)
        {
            case ShipType.Carrier:
                _size = 5;
                break;
            case ShipType.Battleship:
                _size = 4;
                break;
            case ShipType.Cruiser:
            case ShipType.Submarine:
                _size = 3;
                break;
            case ShipType.PatrolBoat:
                _size = 2;
                break;
        }
    }

    // Increase hit count when attacked
    public void Hit()
    {
        _hits++;
    }

    // Check if ship is sunk
    public bool IsSunk()
    {
        return _hits >= _size;
    }

    // Get ship size
    public int GetSize()
    {
        return _size;
    }

    // Get ship name (for display)
    public string GetName()
    {
        return _type.ToString();
    }

    // Get orientation (used by Board)
    public Orientation GetOrientation()
    {
        return _orientation;
    }
}