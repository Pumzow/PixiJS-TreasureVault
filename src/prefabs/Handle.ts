import gsap from "gsap";
import { Container, Point, Sprite } from "pixi.js";
import { config } from "../config";
import { Direction } from "../config";

export class Handle extends Container {
    private isBusy: Boolean
    private sprite!: Sprite;
    private shadow!: Sprite;

    private rotationObservers: ((direction: Direction) => void)[] = [];

    constructor() {
        super();
        this.isBusy = false;

        this.shadow = Sprite.from("handleShadow");
        this.shadow.name = "Shadow";
        this.shadow.anchor.set(.5);
        this.shadow.position.set(-15, -30);

        this.sprite = Sprite.from("handle");
        this.sprite.name = "Handle";
        this.sprite.anchor.set(.5);
        this.sprite.position.set(-23, -55);
        this.sprite.eventMode = "dynamic";

        this.initDragInput();

        this.addChild(this.shadow);
        this.addChild(this.sprite);
    }

    public get onRotate() {
        return {
            add: (observer: (direction: Direction) => void) => {
                this.rotationObservers.push(observer);
            },
            remove: (observer: (direction: Direction) => void) => {
                this.rotationObservers.filter((obs) => obs !== observer);
            },
            invoke: (direction: Direction) => {
                this.rotationObservers.forEach((observer) => observer(direction));
            },
        };
    }

    private async spinHandle(direction: Direction) {
        if(this.isBusy) return;
        const rotation = direction * config.spinRotationAngle * (Math.PI / 180);

        await this.spin(rotation, config.spinDuration);

        this.onRotate.invoke(direction)
    }

    public async spinLikeCrazy() {
        if(this.isBusy) return;
        const rotation = this.sprite.rotation + Math.PI * 2 * config.crazySpinsNumber;
        await this.spin(rotation, config.crazySpinsDuration);
    }

    private async spin(rotation: number, duration: number) {
        this.isBusy = true;

        await gsap.to([this.sprite, this.shadow], {
            rotation: this.sprite.rotation + rotation,
            duration: duration - 0.1,
            ease: "power1.inOut"
        });

        this.isBusy = false
    }

    private initDragInput() {
        let startPoint: Point | null = null;
        let endPoint: Point | null = null;

        this.sprite.on("pointerdown", (event) => {
            if(this.isBusy) return;
            const position = event.data.getLocalPosition(this.sprite.parent);
            startPoint = new Point(position.x, position.y);
        });

        this.sprite.on("pointermove", (event) => {
            if(this.isBusy) return;
            const position = event.data.getLocalPosition(this.sprite.parent);
            endPoint = new Point(position.x, position.y);

            if (startPoint && endPoint) {
                const direction = this.getDirection(startPoint, endPoint);
                if(direction === Direction.NONE) return;
                this.spinHandle(direction);
            }

            startPoint = null;
            endPoint = null;
        });
    }

    private getDirection(start: Point, end: Point): Direction {
        const xDistance = end.x - start.x;

        if (xDistance > 0) {
            return Direction.CLOCKWISE;
        } else if (xDistance < 0) {
            return Direction.COUNTERCLOCKWISE;
        }

        return Direction.NONE;
    }
}