import { CrewMate } from "./crewmate";
import { DeathType } from "./death-type";
import { GameStatus } from "./game-status";

export class Game {
    public players: CrewMate[];
    public gameStastus: GameStatus;
    constructor() { 
        this.players = [];
        this.gameStastus = GameStatus.OnGoing;
    }

    public addPlayer(member: CrewMate){
        this.players.push(member);
    }

    public playerDied(discord: string) {
        let member = this.getPlayerByName(discord);
        if(member !== null){
            member.status = DeathType.killed;
        }
    }

    public playerVoted(discord: string){
        let member = this.getPlayerByName(discord);
        if(member !== null){
            member.status = DeathType.voted;
        }
    }

    public getPlayerByName(discord: string): CrewMate {
        let result = this.players.find((memeber: CrewMate) => {
            if(memeber.discordName === discord) {
                return memeber;
            }
        });
        return result!;
    }
}
