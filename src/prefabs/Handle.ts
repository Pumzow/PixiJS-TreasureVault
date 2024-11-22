import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
import { config } from "../config";
import { Debug } from "../utils/debug";
import { Direction } from "../config";

export class Handle extends Container {
    private sprite!: Sprite;
    private shadow!: Sprite;

    constructor() {
        super();

        this.shadow = Sprite.from("handleShadow");
        this.shadow.name = "Shadow";
        this.shadow.anchor.set(.5);
        this.shadow.position.set(-15, -30);

        this.sprite = Sprite.from("handle");
        this.sprite.name = "Handle";
        this.sprite.anchor.set(.5);
        this.sprite.position.set(-23, -55);

        this.addChild(this.shadow);
        this.addChild(this.sprite);
    }

    public spinHandle(direction: Direction){
        const rotation = direction * 60 * (Math.PI / 180);
        this.spin(rotation, config.rotationTime);
    }

    public spinLikeCrazy() {
        Debug.log("SPIN LIKE CRAZY!");
        const rotation = this.sprite.rotation +  Math.PI * 2 * 5;
        this.spin(rotation, config.spinLikeCrazyTime);
    }

    private spin(rotation: number, duration: number){
        gsap.to(this.sprite, {
            rotation: this.sprite.rotation + rotation,
            duration: duration, 
            ease: "power1.inOut"
        });

        gsap.to(this.shadow, {
            rotation: this.sprite.rotation + rotation,
            duration: duration, 
            ease: "power1.inOut"
        });
    }
}