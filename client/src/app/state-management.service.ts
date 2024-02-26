import { Injectable } from "@angular/core"
import { GameHubService, GameObject, State } from "./connectionManagement/game-hub.service"

export enum Direction {
  Up,
  Down,
  Left,
  Right
}


@Injectable({
  providedIn: "root"
})
export class StateManagementService {
  private stateUpdates: State[] = []


  //questionable
  private renderDelayInMS = 100;
  private gameStart = 0;
  private firstServerTimestamp = 0;


  constructor(private readonly gameHubService: GameHubService) {
    this.gameHubService.stateUpdate$.subscribe((data: State) => {
      if (!this.firstServerTimestamp) {
        this.firstServerTimestamp = data.t;
        this.gameStart = Date.now();
      }

      this.stateUpdates.push(data)
    })
  }

  getCurrentState(): State | null {
    if (!this.firstServerTimestamp) {
      return null;
    }

    const base = this.getBaseUpdate();
    const serverTime = this.currentServerTime();

    // If base is the most recent update we have, use its state.
    // Otherwise, interpolate between its state and the state of (base + 1).
    if (base < 0 || base === this.stateUpdates.length - 1) {
      return this.stateUpdates[this.stateUpdates.length - 1];
    } else {
      const baseUpdate = this.stateUpdates[base];
      const next = this.stateUpdates[base + 1];
      const ratio = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t);
      return {
        ...this.stateUpdates[base],
        currentPlayer: this.interpolateObject(baseUpdate.currentPlayer, next.currentPlayer, ratio),
        players: this.interpolateObjectArray(baseUpdate.players, next.players, ratio),
      };
    }
  }

  movePlayer(e: KeyboardEvent) {
    console.log(e)
    if (e.key === "w") {
      this.gameHubService.moveIntoDirection(Direction.Up)
    } else if (e.key === "s") {
      this.gameHubService.moveIntoDirection(Direction.Down)
    } else if (e.key === "a") {
      this.gameHubService.moveIntoDirection(Direction.Left)
    } else if (e.key === "d") {
      this.gameHubService.moveIntoDirection(Direction.Right)
    }
  }

  move() {
    this.gameHubService.startMoving()
  }

  stopMoving() {
    this.gameHubService.stopMoving()
  }

  private currentServerTime(): number {
    return this.firstServerTimestamp + (Date.now() - this.gameStart) - this.renderDelayInMS;
  }

  private getBaseUpdate(): number {
    const serverTime = this.currentServerTime();
    for (let i = this.stateUpdates.length - 1; i >= 0; i--) {
      if (this.stateUpdates[i].t <= serverTime) {
        return i;
      }
    }
    return -1;
  }

  private interpolateObject<T>(object1: any, object2: any, ratio: number): T {
    if (!object2) {
      return object1;
    }

    let interpolated: any = {};
    Object.keys(object1).forEach((key) => {
      if (key === 'dir') {
        interpolated[key] = this.interpolateDirection(object1[key], object2[key], ratio);
      } else {
        interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio;
      }
    });

    return interpolated as T;
  }

  private interpolateObjectArray<T extends GameObject>(objects1: T[], objects2: T[], ratio: number) {
    return objects1.map((o) =>
      this.interpolateObject(
        o,
        objects2.find((o2) => o.id === o2.id),
        ratio
      )
    ) as T[];
  }

  // Determines the best way to rotate (cw or ccw) when interpolating a direction.
  // For example, when rotating from -3 radians to +3 radians, we should really rotate from
  // -3 radians to +3 - 2pi radians.
  private interpolateDirection(d1: number, d2: number, ratio: number) {
    const absD = Math.abs(d2 - d1);
    if (absD >= Math.PI) {
      // The angle between the directions is large - we should rotate the other way
      if (d1 > d2) {
        return d1 + (d2 + 2 * Math.PI - d1) * ratio;
      } else {
        return d1 - (d2 - 2 * Math.PI - d1) * ratio;
      }
    } else {
      // Normal interp
      return d1 + (d2 - d1) * ratio;
    }
  }
}

