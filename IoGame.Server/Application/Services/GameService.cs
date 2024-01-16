﻿using System.Collections.Concurrent;
using IoGame.Server.Application.Models;

namespace IoGame.Server.Application.Services;

public interface IGameService
{
    Game Game { get; }
    Player AddPlayer(string connectionId);
}

public class GameService : IGameService
{
    Game _game = new();
    public Game Game => _game;

    public Player AddPlayer(string connectionId)
    {
        var game = Game;

        var player = game.AddPlayer(connectionId);

        return player;
    }
}