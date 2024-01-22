using IoGame.Server.Application.Dto;
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

        _gameService.AddPlayer(connectionId);

        Context.Items["playerId"] = connectionId;
    }

    public void ChangeDirection(double direction)
    {
        var player = _gameService.Game.Players.FirstOrDefault(p => p.Id == Context.ConnectionId);
        player?.SetDirection(direction);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _gameService
            .Disconnect(Context.ConnectionId);

        await base.OnDisconnectedAsync(exception);
    }
}