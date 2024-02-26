using IoGame.Server.Application.Models.ValueObjects;

namespace IoGame.Server.Application.Models;

public abstract class GameObject<TId> where TId : IEquatable<TId>
{
    protected GameObject(TId id)
    {
        Id = id;
    }

    public TId Id { get; set; }
    public Point Location { get; set; }
    public int Speed { get; set; }
    public double Direction { get; set; }

    public virtual void Update(double distance)
    {
        Location = new Point(
            (int)(Location.X + Speed * distance * Math.Sin(Direction)),
            (int)(Location.Y - Speed * distance * Math.Cos(Direction)));
    }

    public double DistanceTo(GameObject<TId> obj)
    {
        var dx = obj.Location.X - @obj.Location.X;
        var dy = obj.Location.Y - @obj.Location.Y;

        return Math.Sqrt(dx * dx + dy * dy);
    }

    public void SetDirection(double direction)
    {
        Direction = direction;
    }
}