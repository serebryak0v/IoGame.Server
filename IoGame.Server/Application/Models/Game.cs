using System.Collections;
using System.Collections.Concurrent;
using IoGame.Server.Application.Dto;
using IoGame.Server.Application.Mapping;
using IoGame.Server.Application.Models.ValueObjects;

namespace IoGame.Server.Application.Models;

public sealed class Game
{
    private double _timeDifference;
    private DateTime _lastDateTimeUpdated = DateTime.UtcNow;

    readonly ConcurrentDictionary<string, Player> _players = new();
    public IEnumerable<Player> Players => _players.Values;
    public double TimeDifference => _timeDifference;

    public void Update()
    {
        CalculateTimeSinceLastUpdate();
        UpdatePlayers();
    }

    private void CalculateTimeSinceLastUpdate()
    {
        var now = DateTime.UtcNow;
        _timeDifference = now.Subtract(_lastDateTimeUpdated).TotalSeconds;
        _lastDateTimeUpdated = now;
    }

    public void UpdatePlayers()
    {
        foreach (var player in _players.Values)
        {
            player.Update(_timeDifference);
        }
    }

    public Player AddPlayer(string connectionId)
    {
        var player = Player.Create(connectionId, new Point(1000, 400), 1, 0);

        _players[connectionId] = player;

        return player;
    }

    //TODO: Ugly, fix
    public GameDto CreateUpdate(Player player)
    {
        return new GameDto
        {
            CurrentPlayer = player.ToDto(),
            Players = _players.Values.Where(p => p.Id != player.Id).ToDto(),
            T = _timeDifference
        };
    }

    public void RemovePlayer(string connectionId)
    {
        _players.TryRemove(connectionId, out var player);
    }
}