import { Container, Sprite } from "pixi.js";
import { Handle } from "./Handle";
import { Direction } from "../config";

export class Door extends Container {
    private closedDoor!: Sprite;
    private openedDoor!: Sprite;
    private openedDoorShadow!: Sprite;
    private openedContainer!: Container;
    private handle!: Handle;

    constructor() {
        super();

        this.initClosedDoor();
        this.initOpenDoor();
    }

    private initClosedDoor() {
        this.closedDoor = Sprite.from("door");
        const scaleFactor = window.innerHeight / this.closedDoor.height * .60;
        this.closedDoor.name = "Closed";
        this.closedDoor.scale.set(scaleFactor);
        this.closedDoor.anchor.set(.467, .524);
        this.addChild(this.closedDoor);

        this.handle = new Handle();
        this.closedDoor.addChild(this.handle);
    }

    private initOpenDoor() {
        this.openedContainer = new Container();
        this.openedContainer.name = "Opened"

        this.openedDoorShadow = Sprite.from("doorOpenShadow");
        this.openedDoorShadow.name = "Shadow";
        this.openedDoorShadow.anchor.set(-0.619, 0.482);
        this.openedDoorShadow.scale.set(window.innerHeight / this.openedDoorShadow.texture.height * .61); 
        this.openedContainer.addChild(this.openedDoorShadow);

        this.openedDoor = Sprite.from("doorOpen");
        this.openedDoor.name = "Door";
        this.openedDoor.anchor.set(-0.67, .51);
        this.openedDoor.scale.set(window.innerHeight / this.openedDoor.texture.height * .61);    
        this.openedContainer.addChild(this.openedDoor);
        this.addChild(this.openedContainer);

        this.openedContainer.visible = false;
    }

    public spinHandle(direction: Direction) {
        this.handle.spinHandle(direction);
    }

    public spinHandleLikeCrazy() {
        this.handle.spinLikeCrazy();
    }

    public resize(width: number, height: number) {
        this.resizeSprite(this.closedDoor, width, height / this.closedDoor.texture.height * .60);
        this.resizeSprite(this.openedDoor, width, height / this.openedDoor.texture.height * .61);
        this.resizeSprite(this.openedDoorShadow, width, height / this.openedDoorShadow.texture.height * .61);
    }

    private resizeSprite(sprite: Sprite, width: number, scaleFactor: number){
        sprite.width = width / scaleFactor;
        sprite.scale.set(scaleFactor);
    }
}