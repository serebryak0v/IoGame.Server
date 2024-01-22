using MessagePack;

namespace IoGame.Server.Application.Models.ValueObjects;

[MessagePackObject]
public readonly record struct Point([property: Key("x")]int X = 0, [property: Key("y")]int Y = 0);