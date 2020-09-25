import { AmongUsContext } from "./among-us-context";
import { CrewMate, Game } from "./models/model-index";
import { GameRow, ParticipantRow } from "./databaseModels/database-index";


export class AmongUsService {
    private context: AmongUsContext;
    constructor(database: string) {
        this.context = new AmongUsContext(database);
    }

    public async storeGame(game: Game){
        let gameId = await this.context.addGame(new GameRow(0, game.gameStastus));
        game.players.forEach(async (mate: CrewMate) => {
            let user = await this.context.getUser(mate.discordName);
            await this.context.addPlayer(new ParticipantRow(0, gameId, user.id, mate.status));
        });
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
