import { Component, OnInit } from "@angular/core"
import { GameHubService } from "./connectionManagement/game-hub.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private readonly gameHubService: GameHubService) {
  }

  ngOnInit() {
    this.gameHubService.start()
  }
}
