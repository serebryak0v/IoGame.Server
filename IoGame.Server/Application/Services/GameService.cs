using System.Collections.Concurrent;
using IoGame.Server.Application.Models;

namespace IoGame.Server.Application.Services;

public interface IGameService
{
    Game GetGame();

    Player AddPlayer(string connectionId);
}

public class GameService : IGameService
{
    public Game Game { get; set; }

    public Player AddPlayer(string connectionId)
    {
        var game = GetGame();

        var player = game.AddPlayer(connectionId);

        return player;
    }

    public Game GetGame()
    {
        return Game ?? new Game();
    }
}