import { CrewMate } from "./crewmate";
import { CrewMateType } from "./crewmate-type";
import { DeathType } from "./death-type";
import { GameStatus } from "./game-status";

export class Game {
    public players: CrewMate[];
    public gameStastus: GameStatus;
    constructor() { 
        this.players = [];
        this.gameStastus = GameStatus.OnGoing;
    }

    /* User Controls */

    public newGameWithSamePlayers(){
        this.gameStastus = GameStatus.OnGoing;
        this.players.forEach((crew: CrewMate) => {
            crew.role = CrewMateType.Unknown;
            crew.status = DeathType.alive;
        });
    }

    public addPlayer(member: CrewMate){
        this.players.push(member);
    }

    public removePlayer(discord: string){
        let crewmate = this.players.find((crew: CrewMate) => {
            if(crew.discordName === discord){
                return crew;
            }
        });
        if(crewmate !== undefined) {
            let index = this.players.indexOf(crewmate!, 0);
            this.players.splice(index, 1);
        }
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

    public playerWasImpostor(discord: string) {
        let memeber = this.getPlayerByName(discord);
        if(memeber !== null) {
            memeber.role = CrewMateType.Impostor;
        }
    }

    public playerWasCrewMate(discord: string) {
        let memeber = this.getPlayerByName(discord);
        if(memeber !== null) {
            memeber.role = CrewMateType.CrewMember;
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

    /* END User Controls */

    /* Game Controls */

    public gameIsReadyForStorage() : Boolean {
        if(this.gameStastus === GameStatus.OnGoing || this.players.length < 4){
            return false;
        }
        let isReady = true;
        this.players.forEach((crew: CrewMate) => {
            if(crew.role === CrewMateType.Unknown || crew.role === CrewMateType.Sus){
                isReady = false;
            }
        });
        return isReady;
    }

    public impostorWin(): void {
        this.gameStastus = GameStatus.ImpostorWin;
    }

    public crewmateWin(): void {
        this.gameStastus = GameStatus.CrewmateWin;
    }

    public onGoing(): void {
        this.gameStastus = GameStatus.OnGoing;
    }

    /* END Game Controls */

    public findMissingData(): string {
        if(this.gameStastus === GameStatus.OnGoing){
            return "Game is still in 'On Going' state";
        }
        if(this.players.length < 4){
            return "There are only "+this.players.length + " players. Games need 4";
        }
        let message = "Game is ready to be stored";
        this.players.forEach((crew: CrewMate) => {
            if(crew.role === CrewMateType.Unknown || crew.role === CrewMateType.Sus){
                message = crew.discordName + " needs to input their role";
            }
        });
        return message;
    }
}
