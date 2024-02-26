namespace IoGame.Server.Application.Models.ValueObjects;

public readonly record struct PlayerId(Guid Value)
{
    public static PlayerId Empty => new(Guid.Empty);
    public static PlayerId New() => new(Guid.NewGuid());

    public static implicit operator PlayerId(string str) => new(Guid.Parse(str));

    public bool Equals(PlayerId other) => Value.Equals(other.Value);

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }
}