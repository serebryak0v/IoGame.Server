import { Injectable } from "@angular/core"
import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr"
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack"
import { BehaviorSubject, Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { clientCalls } from "./clientCalls"
import { serverCalls } from "./serverCalls"

export interface Message {
  username: string
  message: string
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

  username = new Date().getTime()

  private stateSubject$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([])
  state$: Observable<Message[]>

  constructor() {
    this.state$ = this.stateSubject$.asObservable()
    this.startConnection()
    this.registerClientCalls()
  }

  private startConnection() {
    this.hubConnection.start().then(() => console.log("Connection started")).catch((err) => console.log(err))
  }

  async sendMessage(message: string) {
    await this.hubConnection.send(serverCalls.sendMessage, this.username, message)
  }

  private registerClientCalls() {
    this.hubConnection.on(clientCalls.messageReceived, (data: Message) => {
      const state = this.stateSubject$.value
      state.push(data)
      this.stateSubject$.next(state)
    })
  }
}
