
using IoGame.Server.Application.Models.Enums;
using IoGame.Server.Application.Models.ValueObjects;

namespace IoGame.Server.Application.Models;

public class Player : GameObject<PlayerId>
{
    private Player(string connectionId, Point location = default, int speed = 0, double direction = 0) :
        base(PlayerId.New())
    {
        Id = PlayerId.New();
        Username = connectionId;
        ConnectionId = connectionId;
        Location = location;
        Speed = speed;
        Direction = direction;
    }

    public string Username { get; init; }

    public string ConnectionId { get; set; }

    public Direction Direction2 { get; set; }

    public override void Update(double distance)
    {
        switch (Direction2)
        {
            case Enums.Direction.Up:
                Location = Location with { Y = Location.Y - Speed };
                break;
            case Enums.Direction.Down:
                Location = Location with { Y = Location.Y + Speed };
                break;
            case Enums.Direction.Left:
                Location = Location with { X = Location.X - Speed };
                break;
            case Enums.Direction.Right:
                Location = Location with { X = Location.X + Speed };
                break;
        }
    }

    public static Player Create(string connectionId, Point startingLocation, int speed, double direction)
    {
        return new Player(connectionId, startingLocation, speed, direction);
    }

    public void MoveIntoDirection(Direction direction)
    {
        Direction2 = direction;
    }

    public void Move(bool isMoving)
    {
        Speed = isMoving ? 5 : 0;
    }
}