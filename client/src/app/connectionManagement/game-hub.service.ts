import { Injectable } from "@angular/core"
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr"
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack"
import { BehaviorSubject, Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { ClientCalls } from "./clientCalls"
import { ServerCalls } from "./serverCalls"

export interface Location {
  x: number
  y: number
}

export interface State {
  t: number
  currentPlayer: Player
  players: Player[]
}

export interface Player extends GameObject {
}

export interface GameObject {
  id: string
  dir: number
  location: Location
}

@Injectable({
  providedIn: "root"
})
export class GameHubService {
  private hubConnection: HubConnection = new HubConnectionBuilder()
    .withUrl(environment.gameHubUrl, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    })
    .withHubProtocol(new MessagePackHubProtocol())
    .configureLogging(environment.signalRLogLevel)
    .build()

  private stateUpdateSubject$: BehaviorSubject<State> = new BehaviorSubject<State>({} as State)
  stateUpdate$: Observable<State>

  constructor() {
    this.stateUpdate$ = this.stateUpdateSubject$.asObservable()

    this.registerClientCalls()
  }

  public async startGame() {
    this.ensureConnected()
    await this.hubConnection.send(ServerCalls.join);
  }

  public async changeDirection(direction: number) {
    this.ensureConnected()
    await this.hubConnection.send(ServerCalls.changeDirection, direction);
  }

  public start() {
    this.hubConnection.start().then(() => this.startGame())
  }

  private registerClientCalls() {
    this.hubConnection.on(ClientCalls.gameUpdate, (data: State) => {
      this.stateUpdateSubject$.next(data)
    })
  }

  private ensureConnected() {
    if (this.hubConnection.state !== HubConnectionState.Connected) {
      throw new Error("Not connected")
    }
  }
}
