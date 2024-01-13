using IoGame.Server;
using IoGame.Server.Application.Hubs;
using Microsoft.AspNetCore.Http.Connections;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR().AddMessagePackProtocol();

builder.Services.AddHostedService<GameLoopHostedService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapHub<GameHub>("/gameHub", opts =>
{
    opts.Transports = HttpTransportType.WebSockets;
});
app.Run();