import { LogLevel } from "@microsoft/signalr"

export const environment = {
  production: false,
  gameHubUrl: "http://localhost:5099/gamehub",
  signalRLogLevel: LogLevel.Debug
};
