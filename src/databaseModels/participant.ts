import { Game } from "./game";
import { CrewMateType } from "./crewmate-type";
import { DeathType } from "./death-type";

export class Participant {
    constructor(public id: number, gameId: number, crewMate: CrewMateType, deathType: DeathType) {
    }
}
