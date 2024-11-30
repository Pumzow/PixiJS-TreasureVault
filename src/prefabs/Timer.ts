import { Container, Graphics, Text, Ticker } from "pixi.js";

const backgroundConfig = {
    positionX: -314,
    positionY: -39.5,
    width: 50,
    height: 20,
};

export class Timer extends Container {
    private startTime: number;
    private isPaused: boolean;
    private background: Graphics;
    private display: Text;

    constructor() {
        super();

        this.startTime = Date.now();
        this.isPaused = false;

        this.background = new Graphics();
        this.background.beginFill(0x000000, 0.01);
        this.background.drawRect(0, 0, backgroundConfig.width, backgroundConfig.height);
        this.background.endFill();
        const scaleFactor = window.innerHeight / this.background.height * .025;
        this.background.scale.set(scaleFactor);
        this.background.pivot.set(this.background.width / 2, this.background.height / 2);
        this.background.position.set(backgroundConfig.positionX * scaleFactor, backgroundConfig.positionY * scaleFactor);

        this.display = new Text("00:00", {
            fontFamily: "Impact",
            fontSize: 18,
            fill: "red",
        });

        this.display.anchor.set(.5);
        this.display.position.set(this.background.width / 2, this.background.height / 2);

        this.addChild(this.background);
        this.background.addChild(this.display);

        Ticker.shared.add(() => {
            this.updateDisplay();
        });
    }

    private updateDisplay() {
        if (this.isPaused) return;

        const elapsedTime = (Date.now() - this.startTime) / 1000;
        this.display.text = this.formatToMinutesSeconds(elapsedTime);
    }

    public pause() {
        this.isPaused = true;
        this.display.style.fill = "green";
    }

    public resume() {
        this.startTime = Date.now();
        this.isPaused = false;
        this.display.style.fill = "red";
    }

    public reset() {
        this.display.style.fill = "red";
        this.display.text = "RESET";
    }

    private formatToMinutesSeconds(totalSeconds: number): string {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        return `${formattedMinutes}:${formattedSeconds}`;
    }
}
