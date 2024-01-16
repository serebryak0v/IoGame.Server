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
}