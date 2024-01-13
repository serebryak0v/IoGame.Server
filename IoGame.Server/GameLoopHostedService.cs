using IoGame.Server.Application.Hubs;
using IoGame.Server.Application.Services;
using Microsoft.AspNetCore.SignalR;

namespace IoGame.Server;

public class GameLoopHostedService(
    IGameService gameService,
    IHubContext<GameHub, IGameHub> hubContext)
    : IHostedService, IDisposable
{
    readonly CancellationTokenSource _cts = new();
    PeriodicTimer Timer { get; init; } = new(TimeSpan.FromMilliseconds(GameLoopSettings.FramesPerSecond));
    Task ExecutingTask { get; set; }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        ExecutingTask = Task.Run(async () =>
        {
            while (await Timer.WaitForNextTickAsync(_cts.Token))
            {
                await UpdateGame();
            }
        }, cancellationToken);

        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (ExecutingTask == null)
        {
            return;
        }

        try
        {
            await _cts.CancelAsync();
        }
        finally
        {
            await Task.WhenAny(ExecutingTask, Task.Delay(Timeout.Infinite,
                cancellationToken));
        }
    }

    private async Task UpdateGame()
    {
        var game = gameService.GetGame();
        game.Update();

        foreach (var player in game.Players)
        {
            var gameUpdate = game.CreateUpdate(player);
            await hubContext.Clients.Client(player.Id).GameUpdate(gameUpdate);
        }
    }

    public void Dispose()
    {
        _cts.Cancel();
    }
}