using IoGame.Server.Application.Dto;
using IoGame.Server.Application.Models;

namespace IoGame.Server.Application.Mapping;

public static class MapPlayer
{
    public static PlayerDto ToDto(this Player player)
    {
        return new PlayerDto
        {
            Direction = player.Direction,
            Id = player.Id.ToString(),
            Location = player.Location
        };
    }

    public static IEnumerable<PlayerDto> ToDto(this IEnumerable<Player> players)
    {
        return players.Select(ToDto);
    }
}