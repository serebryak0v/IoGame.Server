using IoGame.Server.Application.Dto;
using IoGame.Server.Application.Models.Enums;
using IoGame.Server.Application.Models.ValueObjects;
using IoGame.Server.Application.Services;
using Microsoft.AspNetCore.SignalR;

namespace IoGame.Server.Application.Hubs;

public interface IGameHub
{
    Task GameUpdate(GameDto game);
}

public sealed class GameHub : Hub<IGameHub>
{
    readonly IGameService _gameService;

    public GameHub(IGameService gameService)
    {
        _gameService = gameService;
    }

    public void Join()
    {
        var connectionId = Context.ConnectionId;

        var player = _gameService.AddPlayer(connectionId);

        Context.Items["playerId"] = player.Id.Value;
    }

    public void Move(bool isMoving)
    {
        var playerId = Context.Items["playerId"];

        if (playerId == null)
            return;

        var player = _gameService.Game.Players.FirstOrDefault(p => p.Id.Value == (Guid) playerId);
        player.Move(isMoving);
    }

    public void MoveIntoDirection(int direction)
    {
        var playerId = Context.Items["playerId"];

        if (playerId == null)
            return;

        var player = _gameService.Game.Players.FirstOrDefault(p => p.Id.Value == (Guid) playerId);
        player.MoveIntoDirection((Direction) direction);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _gameService
            .Disconnect(Context.ConnectionId);

        await base.OnDisconnectedAsync(exception);
    }
}