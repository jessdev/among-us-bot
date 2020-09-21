import { CrewMateType } from "./crewmate-type";

export class Game {
    constructor(public id: number, public winnerType: CrewMateType) { }
}
