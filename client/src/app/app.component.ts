import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { GameHubService, Message } from "./connectionManagement/game-hub.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  messages: Message[] = []

  @ViewChild("test") test!: ElementRef
  constructor(private readonly gameHubService: GameHubService) {
    gameHubService.state$.subscribe((data) => this.messages = data)
  }

  ngOnInit() {
    window.addEventListener("keyup", async (e: KeyboardEvent) => {
      if (e.key === "Enter")
        await this.gameHubService.sendMessage(this.test.nativeElement.value)
    })
  }
}
