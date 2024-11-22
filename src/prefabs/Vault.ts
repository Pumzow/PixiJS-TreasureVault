import { Debug } from "../utils/debug";
import Keyboard from "../core/Keyboard";
import { Container, Sprite } from "pixi.js";
import { centerObjects, pickRandom, getRandomNumberBetween, wait } from "../utils/misc";
import { Door } from "./Door";
import { config, Direction } from "../config";

export class Vault extends Container {
    private pairs!: CombinationPair[];
    private keyboard = Keyboard.getInstance();
    private door!: Door;
    private background!: Sprite;
    private busy: Boolean;

    constructor() {
        super();
        this.busy = false;
        this.init();

        this.door = new Door();
        this.addChild(this.door);

        centerObjects(this);

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

    async rotate(direction: Direction) {
        if(this.busy) return;
        this.busy = true;
        if (this.pairs[0].getDirection() !== direction) {
            // FAIL STATE
            Debug.log("WRONG VAULT COMBINATION!");
            Debug.log("RESTARTING GAME...");

            this.door.spinHandleLikeCrazy();

            this.generateCombination();
            await wait(config.spinLikeCrazyTime).then(() => this.busy = false);
            return;
        }

        this.door.spinHandle(direction);
        await wait(config.rotationTime).then(() => this.busy = false);

        const rotationsLeft = this.pairs[0].subtractRotations();
        Debug.log(`${rotationsLeft} ${Direction[direction]} rotations left.`);
        if (rotationsLeft === 0) {
            if (this.pairs.length > 0) {
                this.pairs.splice(0, 1);
            }

            if (this.pairs.length === 0) {
                // COMPLETE STATE 
                Debug.log("VAULT UNLOCKED!");
            }
        }
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
                this.rotate(Direction.COUNTERCLOCKWISE);
                break;
            case "RIGHT":
                this.rotate(Direction.CLOCKWISE);
                break;

            default:
                break;
        }
    }

    resize(width: number, height: number) {
        const scaleFactor = height / this.background.texture.height;

        this.background.width = width / scaleFactor;
        this.background.scale.set(scaleFactor);

        centerObjects(this);

        this.door.resize(width, height);
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