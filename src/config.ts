export const config = {
    rotationTime: 1,
    spinLikeCrazyTime: 3,
    gameRestartTime: 5,
    rotationAngle: 60,
    combinationsNumber: 3,
    combinationsRange: {min: 1, max: 9},
}

export enum Direction {
    CLOCKWISE = 1,
    COUNTERCLOCKWISE = -1,
    NONE = 0
}