import { DeathType } from "./death-type";
import { CrewMateType } from "./crewmate-type";

export class CrewMate {
    public role: CrewMateType;
    public status: DeathType;
    constructor(public discordName: string)
    {   
        this.role = CrewMateType.Unknown;
        this.status = DeathType.alive;
    }
}
