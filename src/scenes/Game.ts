import { Sprite } from "pixi.js";
import Scene from "../core/Scene";
import { Vault } from "../prefabs/Vault";

export default class Game extends Scene {
  name = "Game";

  private vault!: Vault;

  load() {
  }

  async start() {
    this.vault = new Vault();
  }

  onResize(width: number, height: number) {
  }
}
