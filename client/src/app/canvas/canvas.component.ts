import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core"
import { filter, fromEvent, interval, map, merge, Subscription, throttleTime } from "rxjs"
import { Player, State } from "../connectionManagement/game-hub.service"
import { StateManagementService } from "../state-management.service"

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.scss"]
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild("canvas", {static: false}) canvas!: ElementRef<HTMLCanvasElement>

  canvasContext: CanvasRenderingContext2D | null = null

  renderingSubscription: Subscription | null = null

  constructor(private readonly stateService: StateManagementService) {

  }

  ngAfterViewInit() {
    this.canvasContext = this.canvas.nativeElement.getContext("2d")

    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;

    this.renderingSubscription = interval(1000 / 60).subscribe(() => this.render(this.stateService.getCurrentState()))

    this.enableMovement()
  }

  render(state: State | null) {
    if (state == null) return

    this.renderBackground()
    this.renderPlayer(state.currentPlayer);
    state.players.forEach((p) => this.renderPlayer(p));
  }

  private renderBackground() {
    if (!this.canvasContext) {
      return;
    }

    this.canvasContext.fillStyle = "grey";
    this.canvasContext.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  private drawPlayerCircle(centerX: number, centerY: number) {
    if (!this.canvasContext) {
      return;
    }

    this.canvasContext.save();
    this.canvasContext.beginPath();
    this.canvasContext.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
    this.canvasContext.fillStyle = 'green';
    this.canvasContext.fill();
    this.canvasContext.lineWidth = 5;
    this.canvasContext.strokeStyle = '#003300';
    this.canvasContext.stroke();
    this.canvasContext.restore();
  }

  private renderPlayer(currentPlayer: Player): void {
    const { location: {x, y}, dir } = currentPlayer;
    const canvasX = x;
    const canvasY = y;

    if (!this.canvasContext) {
      return;
    }

    this.drawPlayerCircle(canvasX, canvasY)
  }

  ngOnDestroy() {
    if(this.renderingSubscription) {
      this.renderingSubscription.unsubscribe()
    }
  }

  private enableMovement() {
    merge(
      fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter((e: KeyboardEvent) => e.key === 'w')),
      fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter((e: KeyboardEvent) => e.key === 'a')),
      fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter((e: KeyboardEvent) => e.key === 's')),
      fromEvent<KeyboardEvent>(document, 'keydown').pipe(filter((e: KeyboardEvent) => e.key === 'd'))
    ).pipe((throttleTime(50))).subscribe((e) =>

      this.stateService.movePlayer(e)
    )
  }
}
