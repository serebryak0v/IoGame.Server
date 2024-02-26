import { Injectable } from "@angular/core"
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr"
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack"
import { BehaviorSubject, Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { Direction } from "../state-management.service"
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

  public async moveIntoDirection(direction: Direction) {
    this.ensureConnected()
    await this.hubConnection.send(ServerCalls.moveIntoDirection, direction);
  }

  public start() {
    this.hubConnection.start().then(() => this.startGame())
  }

  public async startMoving() {
    this.ensureConnected()
    await this.hubConnection.send(ServerCalls.move,true);
  }

  public async stopMoving() {
    this.ensureConnected()
    await this.hubConnection.send(ServerCalls.move, false);
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
