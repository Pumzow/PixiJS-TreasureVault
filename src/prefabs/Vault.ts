import { Debug } from "../utils/debug";
import Keyboard from "../core/Keyboard";
import { Container } from "pixi.js";
import { getRandomNumber } from "../utils/misc";

export class Vault extends Container {
    private pairs!: CombinationPair[];
    private keyboard = Keyboard.getInstance();

    constructor() {
        super();
        this.Reset();

        // INPUT FOR DEBUGGING
        this.keyboard.onAction(({ action, buttonState }) => {
            if (buttonState === "pressed") this.onActionPress(action);
        });
    }

    public Rotate(direction: Direction) {
        if (this.pairs[0].GetDirection() !== direction) {
            // FAIL STATE
            Debug.log("WRONG VAULT COMBINATION!");
            Debug.log("RESTARTING GAME...");
            
            this.Reset();
            return;
        }

        const rotationsLeft = this.pairs[0].SubtractRotations();
        Debug.log(`${rotationsLeft} ${Direction[direction]} rotations left.`);
        if (rotationsLeft === 0) {
            if (this.pairs.length > 0) {
                this.pairs.splice(0, 1);
            } 
            
            if (this.pairs.length === 0){
                // COMPLETE STATE 
                Debug.log("VAULT UNLOCKED!");
            }
        }
    }

    private Reset() {
        this.pairs = [];
        const combinationLog: String[] = [];
        let direction = getRandomNumber(0, 1);

        for (let i = 0; i < 3; i++) {
            const rotations = getRandomNumber(1, 9);
            this.pairs.push(new CombinationPair(direction, rotations));
            combinationLog.push(rotations + " " + Direction[direction]);
            direction = direction === 0 ? 1 : 0;
        }
        Debug.log(combinationLog.join(", "));
    }

    private onActionPress(action: keyof typeof Keyboard.actions) {
        switch (action) {
            case "LEFT":
                this.Rotate(Direction.COUNTERCLOCKWISE);
                break;
            case "RIGHT":
                this.Rotate(Direction.CLOCKWISE);
                break;

            default:
                break;
        }
    }
}

export enum Direction {
    CLOCKWISE = 0,
    COUNTERCLOCKWISE = 1
}

export class CombinationPair {
    private direction!: Direction;
    private rotations!: number;

    constructor(direction: Direction, rotations: number) {
        this.direction = direction;
        this.rotations = rotations;
    }

    public GetDirection() {
        return this.direction;
    }

    public SubtractRotations(): number {
        return --this.rotations;
    }
}