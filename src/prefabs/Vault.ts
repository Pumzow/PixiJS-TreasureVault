import { Debug } from "../utils/debug";
import { Container, Sprite } from "pixi.js";
import { centerObjects, pickRandom, getRandomNumber, wait } from "../utils/misc";
import { Door } from "./Door";
import { config, Direction } from "../config";
import { Timer } from "./Timer";
import { Handle } from "./Handle";

export class Vault extends Container {
    private pairs!: CombinationPair[];
    private door!: Door;
    private background!: Sprite;
    private timer: Timer;
    private handle!: Handle;

    constructor() {
        super();
        this.init();

        this.door = new Door();
        this.addChild(this.door);

        this.timer = new Timer();
        this.addChild(this.timer);

        centerObjects(this);

        this.handle = this.door.getHandle();
        const handleRotationObserver = (direction: Direction) => {
            if (direction === Direction.NONE) return;
            this.onHandleRotation(direction);
        };
        this.handle.onRotate.add(handleRotationObserver);
    }

    private init() {
        this.background = Sprite.from("bg");
        const scaleFactor = window.innerHeight / this.background.height;
        this.background.name = "Background";
        this.background.scale.set(scaleFactor);
        this.background.anchor.set(.5);
        this.addChild(this.background);

        this.generateCombination();
    }

    private onHandleRotation(direction: Direction) {
        if (this.pairs.length === 0) return;
        if (this.pairs[0].getDirection() !== direction) {
            this.fail();
            return;
        }

        const rotationsLeft = this.pairs[0].subtractRotations();
        if (rotationsLeft === 0) {
            if (this.pairs.length > 0) {
                this.pairs.splice(0, 1);
            }

            if (this.pairs.length === 0) {
                this.unlockVault();
            }
        }
    }

    private async unlockVault() {
        this.timer.pause();
        this.door.open();

        await wait(config.gameRestartTime);

        this.generateCombination();
        this.door.close();
        this.timer.reset();
        await this.handle.spinLikeCrazy();

        this.timer.resume();
    }

    private async fail() {
        this.generateCombination();
        this.timer.pause();
        this.timer.reset();
        
        await this.handle.spinLikeCrazy();

        this.timer.resume();
    }

    private generateCombination() {
        this.pairs = [];
        const combinationLog: String[] = [];
        let direction = pickRandom([Direction.CLOCKWISE, Direction.COUNTERCLOCKWISE]);

        for (let i = 0; i < config.combinationsNumber; i++) {
            const rotations = getRandomNumber(config.combinationsRange.min, config.combinationsRange.max);
            this.pairs.push(new CombinationPair(direction, rotations));
            combinationLog.push(rotations + " " + Direction[direction]);
            direction *= -1
        }
        Debug.log(combinationLog.join(", "));
    }

    resize(width: number, height: number) {
        const scaleFactor = height / this.background.height;
        this.width = width / scaleFactor;
        this.scale.set(scaleFactor);        

        centerObjects(this);
    }
}

class CombinationPair {
    private direction!: Direction;
    private rotations!: number;

    constructor(direction: Direction, rotations: number) {
        this.direction = direction;
        this.rotations = rotations;
    }

    public getDirection() {
        return this.direction;
    }

    public subtractRotations(): number {
        return --this.rotations;
    }
}