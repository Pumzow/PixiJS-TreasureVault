import { DisplayObject, Sprite } from "pixi.js";

export function centerObjects(...toCenter: DisplayObject[]) {
  const center = (obj: DisplayObject) => {
    obj.x = window.innerWidth / 2;
    obj.y = window.innerHeight / 2;

    if (obj instanceof Sprite) {
      obj.anchor.set(0.5);
    }
  };

  toCenter.forEach(center);
}

export function wait(seconds: number) {
  return new Promise<void>((res) => setTimeout(res, seconds * 1000));
}

export async function after(
  seconds: number,
  callback: (...args: unknown[]) => unknown
) {
  await wait(seconds);
  return callback();
}

export function getEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Entries<T>;
}


export function getRandomNumberBetween(min: number, max: number): number {
    if (min + 1 > max - 1) {
        throw new Error(`no in-between numbers (${min}-${max})`);
    }
    return Math.floor(Math.random() * (max - min - 1)) + min + 1;
}
