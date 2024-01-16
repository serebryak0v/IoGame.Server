
using IoGame.Server.Application.Models.ValueObjects;

namespace IoGame.Server.Application.Models;

public class Player : GameObject
{
    private Player(string connectionId, Point location = default, int speed = 0, double direction = 0)
    {
        Id = connectionId;
        Username = connectionId;
        Location = location;
        Speed = speed;
        Direction = direction;
    }

    public string Username { get; init; }

    public override void Update(double distance)
    {
        base.Update(distance);
    }

    public static Player Create(string connectionId, Point startingLocation, int speed, double direction)
    {
        return new Player(connectionId, startingLocation, speed, direction);
    }
}