import { Container, Graphics, Text, Ticker } from "pixi.js";
import { config } from "../config";

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
        this.background.drawRect(0, 0, config.timerBackground.width, config.timerBackground.height);
        this.background.endFill();
        const scaleFactor = window.innerHeight / this.background.height * .025;
        this.background.scale.set(scaleFactor);
        this.background.pivot.set(this.background.width / 2, this.background.height / 2);
        this.background.position.set(config.timerBackground.positionX * scaleFactor, config.timerBackground.positionY * scaleFactor);

        this.display = new Text("00:00", {
            fontFamily: config.timerFont,
            fontSize: config.timerFontSize,
            fill: config.timerInactiveColor,
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
        this.display.style.fill = config.timerActiveColor;
    }

    public resume() {
        this.startTime = Date.now();
        this.isPaused = false;
        this.display.style.fill = config.timerInactiveColor;
    }

    public reset() {
        this.display.style.fill = config.timerInactiveColor;
        this.display.text = config.timerRestartText;
    }

    private formatToMinutesSeconds(totalSeconds: number): string {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        return `${formattedMinutes}:${formattedSeconds}`;
    }
}
