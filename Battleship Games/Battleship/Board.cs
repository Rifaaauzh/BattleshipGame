public class Board
{
    private int _size;
    private Cell[,] _cells;

    public Board(int size)
    {
        _size = size;
        _cells = new Cell[size, size];

        // initialize cells
        for (int i = 0; i < size; i++)
        {
            for (int j = 0; j < size; j++)
            {
                _cells[i, j] = new Cell();
            }
        }
    }

    public bool PlaceShip(Ship ship, Position pos)
    {
        if (!IsValidPlacement(ship, pos))
            return false;

        int size = ship.GetSize();

        for (int i = 0; i < size; i++)
        {
            int x = pos.X;
            int y = pos.Y;

            if (ship.GetOrientation() == Orientation.Horizontal)
                y += i;
            else
                x += i;

            _cells[x, y].SetShip(ship);
        }

        return true;
    }

    private bool IsValidPlacement(Ship ship, Position pos)
    {
        int size = ship.GetSize();

        for (int i = 0; i < size; i++)
        {
            int x = pos.X;
            int y = pos.Y;

            if (ship.GetOrientation() == Orientation.Horizontal)
                y += i;
            else
                x += i;

            // out of bounds
            if (x >= _size || y >= _size)
                return false;

            // overlap
            if (_cells[x, y].HasShip())
                return false;
        }

        return true;
    }

    public bool ReceiveAttack(Position pos)
    {
        Cell cell = _cells[pos.X, pos.Y];

        if (cell.HasShip())
        {
            cell.GetShip().Hit();
            return true; // hit
        }

        return false; // miss
    }

    public bool IsAllSunk()
    {
        foreach (var cell in _cells)
        {
            if (cell.HasShip() && !cell.GetShip().IsSunk())
                return false;
        }

        return true;
    }
}