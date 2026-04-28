using Battleship.Interfaces;

namespace Battleship.Models;

public class Board : IBoard
{
    public int Size { get; }
    public Cell[,] Cells { get; }

    public Board(int size)
    {
        Size = size;
        Cells = new Cell[size, size];

        for (int x = 0; x < size; x++)
        {
            for (int y = 0; y < size; y++)
            {
                Cells[x, y] = new Cell(new Position(x, y));
            }
        }
    }

    public ICell GetCell(Position position)
    {
        return Cells[position.X, position.Y];
    }
}