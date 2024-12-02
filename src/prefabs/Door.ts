import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
import { Handle } from "./Handle";
import { getRandomNumber, wait } from "../utils/misc";
import { config } from "../config";

export class Door extends Container {
    private closedDoor!: Sprite;
    private openedDoor!: Sprite;
    private openedDoorShadow!: Sprite;
    private openedContainer!: Container;
    private handle!: Handle;
    private glittersContainer!: Container;

    constructor() {
        super();

        this.glittersContainer = new Container();
        this.glittersContainer.name = "Blinks";

        this.initClosedDoor();
        this.initOpenDoor();
    }

    public getHandle(): Handle {
        return this.handle;
    }

    public open() {
        this.closedDoor.visible = false;
        this.openedContainer.visible = true;

        this.initGlitterEffect();
    }

    public close() {
        this.closedDoor.visible = true;
        this.openedContainer.visible = false;

        while (this.glittersContainer.children[0]) {
            this.glittersContainer.removeChild(this.glittersContainer.children[0]);
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
        const endTime = Date.now() + config.gameRestartTime * 1000;

        while (Date.now() < endTime) {
            const glitter = Sprite.from("blink");
            glitter.name = "blink";
            glitter.anchor.set(0.5, 0.5);
            glitter.alpha = 0;

            const scaleFactor = window.innerHeight / glitter.texture.height * 0.21;
            glitter.width = window.innerWidth / scaleFactor;
            glitter.scale.set(scaleFactor);

            glitter.x = getRandomNumber(config.glitterEffect.position.minX, config.glitterEffect.position.maxX);
            glitter.y = getRandomNumber(config.glitterEffect.position.minY, config.glitterEffect.position.maxY);

            this.glittersContainer.addChild(glitter);
            this.openedContainer.addChild(this.glittersContainer);

            gsap.to(glitter, {
                alpha: 1,
                duration: getRandomNumber(config.glitterEffect.effectDuration.min, config.glitterEffect.effectDuration.max),
                ease: "power1.inOut",
                yoyo: true,
                repeat: 1,
            });

            await wait(config.glitterEffect.spawnRate);
        }
    }
}