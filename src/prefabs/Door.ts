import { Container, Sprite } from "pixi.js";
import { Handle } from "./Handle";
import { Direction } from "../config";

export class Door extends Container {
    private sprite!: Sprite;
    private handle!: Handle;

    constructor() {
        super();

        this.sprite = Sprite.from("door");
        const scaleFactor = window.innerHeight / this.sprite.height * .62;
        this.sprite.name = "Door";
        this.sprite.scale.set(scaleFactor);
        this.sprite.anchor.set(.467, .53);
        this.addChild(this.sprite);

        this.handle = new Handle();
        this.sprite.addChild(this.handle);
    }

    public spinHandle(direction: Direction){
        this.handle.spinHandle(direction);
    }

    public spinHandleLikeCrazy(){
        this.handle.spinLikeCrazy();
    }

    public resize(width: number, height: number) {
        const scaleFactor = height / this.sprite.texture.height * .62;

        this.sprite.width = width / scaleFactor;
        this.sprite.scale.set(scaleFactor);
    }
}