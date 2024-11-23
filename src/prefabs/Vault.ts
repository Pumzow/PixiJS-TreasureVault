import { Debug } from "../utils/debug";
import Keyboard from "../core/Keyboard";
import { Container, Sprite } from "pixi.js";
import { centerObjects, pickRandom, getRandomNumberBetween, wait } from "../utils/misc";
import { Door } from "./Door";
import { config, Direction } from "../config";
import { Timer } from "./Timer";
import { Handle } from "./Handle";

export class Vault extends Container {
    private pairs!: CombinationPair[];
    private keyboard = Keyboard.getInstance();
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
            if(direction === Direction.NONE) return;
            this.onHandleRotation(direction);
        };
        this.handle.onRotate.add(handleRotationObserver);

        // INPUT FOR DEBUGGING
        this.keyboard.onAction(({ action, buttonState }) => {
            if (buttonState === "pressed") this.onActionPress(action);
        });
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
            // FAIL STATE
            Debug.log("WRONG VAULT COMBINATION!");
            Debug.log("RESTARTING GAME...");

            this.Fail();
            return;
        }

        const rotationsLeft = this.pairs[0].subtractRotations();
        Debug.log(`${rotationsLeft} ${Direction[direction]} rotations left.`);
        if (rotationsLeft === 0) {
            if (this.pairs.length > 0) {
                this.pairs.splice(0, 1);
            }

            if (this.pairs.length === 0) {
                this.UnlockVault();
            }
        }
    }

    private async UnlockVault() {
        Debug.log("VAULT UNLOCKED!");
        this.timer.pause();
        this.door.Open();
        await wait(config.gameRestartTime).then(() => {
            this.generateCombination();

            this.door.Close();
            this.handle.spinLikeCrazy();
            this.timer.reset();
            wait(config.spinLikeCrazyTime).then(() => {
                this.timer.resume();
            });
        });
    }

    private async Fail() {
        this.generateCombination();

        this.handle.spinLikeCrazy();
        this.timer.pause();
        this.timer.reset();
        await wait(config.spinLikeCrazyTime).then(() => {
            this.timer.resume();
        });
    }

    private generateCombination() {
        this.pairs = [];
        const combinationLog: String[] = [];
        let direction = pickRandom([Direction.CLOCKWISE, Direction.COUNTERCLOCKWISE]);

        for (let i = 0; i < 3; i++) {
            const rotations = getRandomNumberBetween(1, 9);
            this.pairs.push(new CombinationPair(direction, rotations));
            combinationLog.push(rotations + " " + Direction[direction]);
            direction = direction === -1 ? 1 : -1;
        }
        Debug.log(combinationLog.join(", "));
    }

    private onActionPress(action: keyof typeof Keyboard.actions) {
        switch (action) {
            case "LEFT":
                this.onHandleRotation(Direction.COUNTERCLOCKWISE);
                break;
            case "RIGHT":
                this.onHandleRotation(Direction.CLOCKWISE);
                break;
            case "JUMP":
                this.door.Open();
                break;

            default:
                break;
        }
    }

    resize(width: number, height: number) {
        const scaleFactor = height / this.background.texture.height;

        this.background.width = width / scaleFactor;
        this.background.scale.set(scaleFactor);

        this.door.resize(width, height);
        this.timer.resize(width, height);

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