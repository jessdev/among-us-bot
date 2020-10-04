import { AmongUsContext } from "./among-us-context";
import { CrewMate, Game } from "./models/model-index";
import { CrewMateRow, GameRow, ParticipantRow } from "./databaseModels/database-index";


export class AmongUsService {
    private context: AmongUsContext;
    constructor(database: string) {
        this.context = new AmongUsContext(database);
    }

    public async storeGame(game: Game): Promise<number> {
        let gameId = await this.context.addGame(new GameRow(0, game.gameStastus));
        let addPlayers: any[] = [];
        game.players.forEach(async (mate: CrewMate) => {
            let user = await this.context.getUser(mate.discordName);
            addPlayers.push(this.context.addPlayer(new ParticipantRow(0, gameId, user.id, mate.role, mate.status)));
        });
        await Promise.all(addPlayers);
        return gameId;
    }

    public async getGame(id: number): Promise<Game> {
        let exportGame = new Game();

        let game = await this.context.getGame(id);
        exportGame.gameStastus = game.winnerTypeId;

        let participants = await this.context.getParticipantByGameId(id);
        console.log(participants);
        for(let i = 0; i < participants.length; i++) {
            let part = participants[i];
            let crewmate = await this.context.getCrewmate(part.crewmateId);
            let member = new CrewMate(crewmate.discord);
            member.role = part.roleId;
            member.status = part.statusId;
            exportGame.addPlayer(member);
        }

        return exportGame;
    }

    public async registerUser(user: string) {
        try{
            await this.context.registerUser(user);
        }
        catch(error){
            console.log(error);
        }
    }
}
