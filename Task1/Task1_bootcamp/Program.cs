
string input = Console.ReadLine();
int userInput = int.Parse(input);

for (int i = 1; i <= userInput; i++)
{
    if (i % 3 == 0)
    {
        Console.WriteLine("foo");
    }
    else if (i % 5 == 0)
    {
        Console.WriteLine("bar");
    }
    if (i % 3 == 0 && i % 5 == 0 )
    {
        Console.WriteLine("foobar");
    }
    else
    {
        Console.WriteLine(i);
    }
}