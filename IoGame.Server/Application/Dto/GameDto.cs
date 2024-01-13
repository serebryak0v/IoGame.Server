using MessagePack;

namespace IoGame.Server.Application.Dto;

[MessagePackObject]
public class GameDto
{
    [Key("t")]
    public double T { get; set; }

    [Key("currentPlayer")]
    public PlayerDto CurrentPlayer { get; init; }

    [Key("players")]
    public IEnumerable<PlayerDto> Players { get; set; }
}