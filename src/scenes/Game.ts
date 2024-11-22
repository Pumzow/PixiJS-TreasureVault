import Scene from "../core/Scene";
import { Vault } from "../prefabs/Vault";

export default class Game extends Scene {
  name = "Game";

  private vault!: Vault;

  load() {
  }

  async start() {
    await this.utils.assetLoader.loadAssetsGroup("Game");
    this.vault = new Vault();

    this.addChild(this.vault);
  }

  onResize(width: number, height: number) {
    this.vault.resize(width, height);
  }
}
