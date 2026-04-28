namespace Battleship.Models;

public class ServiceResult<T>
{
    public T? Data { get; set; }
    public bool IsSuccess { get; set; }
    public string Message { get; set; }

    public static ServiceResult<T> Success(T data, string message = "Success")
    {
        ServiceResult<T> result = new ServiceResult<T>();

        result.Data = data;
        result.IsSuccess = true;
        result.Message = message;

        return result;
    }

    public static ServiceResult<T> Failure(string message)
    {
        ServiceResult<T> result = new ServiceResult<T>();

        result.Data = default;
        result.IsSuccess = false;
        result.Message = message;

        return result;
    }
}