using IoGame.Server.Application.Dto;
using IoGame.Server.Application.Services;
using MessagePack;
using Microsoft.AspNetCore.SignalR;

namespace IoGame.Server.Application.Hubs;

public interface IGameHub
{
    Task Join();
    Task GameUpdate(GameDto game);
}

public class GameHub(IGameService gameService) : Hub<IGameHub>
{
    public Task Join()
    {
        var connectionId = Context.ConnectionId;

        gameService.AddPlayer(connectionId);

        Context.Items["playerId"] = connectionId;

        return Task.CompletedTask;
    }
}