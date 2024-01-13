using IoGame.Server.Application.Models.ValueObjects;
using MessagePack;

namespace IoGame.Server.Application.Dto;

[MessagePackObject]
public class PlayerDto
{
    [Key("id")]
    public string Id { get; set; }

    [Key("location")]
    public Point Location { get; set; }

    [Key("direction")]
    public double Direction { get; set; }
}