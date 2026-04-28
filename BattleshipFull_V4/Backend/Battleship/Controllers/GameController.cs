using Battleship.DTOs;
using Battleship.Models;
using Battleship.Services;
using Microsoft.AspNetCore.Mvc;

namespace Battleship.Controllers;

[ApiController]
[Route("api/game")]
public class GameController : ControllerBase
{
    private readonly GameService _gameService;

    public GameController(GameService gameService)
    {
        _gameService = gameService;
    }

    [HttpPost("start")]
    public IActionResult StartGame([FromBody] StartGameRequest request)
    {
        ServiceResult<StartGameResponse> result = _gameService.StartGame(request);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("place-ship")]
    public IActionResult PlaceShip([FromBody] PlaceShipRequest request)
    {
        ServiceResult<MessageResponse> result = _gameService.PlaceShip(request);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("shoot")]
    public IActionResult Shoot([FromBody] ShootRequest request)
    {
        ServiceResult<ShootResponse> result = _gameService.Shoot(request);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("board")]
    public IActionResult GetBoard()
    {
        ServiceResult<BoardResponse> result = _gameService.GetBoard();

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("auto-place-bot")]
    public IActionResult AutoPlaceBot()
    {
        ServiceResult<MessageResponse> result = _gameService.AutoPlaceBot();

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}