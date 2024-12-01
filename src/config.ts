export const config = {
    spinRotationAngle: 60,
    spinDuration: 1,
    crazySpinsDuration: 3,
    crazySpinsNumber: 5,
    gameRestartTime: 5,
    combinationsNumber: 3,
    combinationsRange: {min: 1, max: 9},
    timerFont: "Impact",
    timerFontSize: 18,
    timerRestartText: "RESET",
    timerActiveColor: "green",
    timerInactiveColor: "red",
    timerBackground: {
        positionX: -314,
        positionY: -39.5,
        width: 50,
        height: 20,
    }
}

export enum Direction {
    CLOCKWISE = 1,
    COUNTERCLOCKWISE = -1,
    NONE = 0
}