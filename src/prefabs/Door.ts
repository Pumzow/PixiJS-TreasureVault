import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
import { Handle } from "./Handle";
import { pickRandom, wait } from "../utils/misc";

export class Door extends Container {
    private closedDoor!: Sprite;
    private openedDoor!: Sprite;
    private openedDoorShadow!: Sprite;
    private openedContainer!: Container;
    private handle!: Handle;
    private glittersContainer!: Container;
    private cachedGlithers!: Sprite[];

    constructor() {
        super();

        this.cachedGlithers = [];
        this.glittersContainer = new Container();
        this.glittersContainer.name = "Blinks";

        this.initClosedDoor();
        this.initOpenDoor();
    }

    public getHandle(): Handle{
        return this.handle;
    }

    public Open() {
        this.closedDoor.visible = false;
        this.openedContainer.visible = true;

        this.initGlitterEffect();
    }

    public Close() {
        this.closedDoor.visible = true;
        this.openedContainer.visible = false;

        for (let i = 0; i < this.cachedGlithers.length; i++) {
            this.glittersContainer.removeChild(this.cachedGlithers[i]);
        }
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

    private async initGlitterEffect() {
        const anchors = [{ x: 1.32, y: 0.54 }, { x: 0.25, y: -0.04 }, { x: 0.65, y: 0.561 }]
        this.cachedGlithers = [];

        for (let i = 0; i < 3; i++) {
            await wait(.5).then(() => {
                const glitter = Sprite.from("blink");
                glitter.name = `${i + 1}`;
                glitter.anchor.set(anchors[i].x, anchors[i].y);
                glitter.alpha = 0;
                this.resizeSprite(glitter, window.innerWidth, window.innerHeight / glitter.texture.height * .21)

                this.glittersContainer.addChild(glitter);
                this.openedContainer.addChild(this.glittersContainer);

                this.cachedGlithers.push(glitter);

                gsap.timeline({ repeat: -1 })
                    .to(glitter, {
                        alpha: 1,
                        duration: pickRandom([1, .7]),
                        ease: "power1.inOut",
                    })
                    .to(glitter, {
                        alpha: 0,
                        duration: pickRandom([1, .7]),
                        ease: "power1.inOut",
                    });
            });
        }
    }

    public resize(width: number, height: number) {
        this.resizeSprite(this.closedDoor, width, height / this.closedDoor.texture.height * .60);
        this.resizeSprite(this.openedDoor, width, height / this.openedDoor.texture.height * .61);
        this.resizeSprite(this.openedDoorShadow, width, height / this.openedDoorShadow.texture.height * .61);
        for (let i = 0; i < this.cachedGlithers.length; i++) {
            this.resizeSprite(this.cachedGlithers[i], width, height / this.cachedGlithers[i].texture.height * .21)
        }
    }

    private resizeSprite(sprite: Sprite, width: number, scaleFactor: number) {
        sprite.width = width / scaleFactor;
        sprite.scale.set(scaleFactor);
    }
}