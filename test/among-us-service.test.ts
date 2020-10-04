import { v4 as Guid} from "uuid";
import { AmongUsService } from "../src/among-us-service";
import { AmongUsContext } from "../src/among-us-context";
import { CrewMateRow } from "../src/databaseModels/crewmate-row";
import { Game } from "../src/models/game";
import { GameRow } from "../src/databaseModels/game-row";
import { CrewMate } from "../src/models/crewmate";
import { GameStatus } from "../src/models/game-status";

const guid: string = Guid();
const databaseName = guid+".db";
var testContext = new AmongUsContext(databaseName);
let seeding = seedData();
let gameId: number = 0;

let service = new AmongUsService(databaseName);

const game = new Game();
game.addPlayer(new CrewMate("user 1"));
game.addPlayer(new CrewMate("user 2"));
game.addPlayer(new CrewMate("user 3"));
game.addPlayer(new CrewMate("user 4"));

game.playerWasCrewMate("user 1");
game.playerWasCrewMate("user 2");
game.playerWasImpostor("user 3");
game.playerWasCrewMate("user 4");

game.playerDied("user 1");
game.playerVoted("user 2");
game.impostorWin();

test("Store Game", async () => {
    await seeding;
    gameId = await service.storeGame(game);
    expect(gameId).toBe(1);
});

test("Get Game by Id", async () => {
    await seeding;
    let game = await service.getGame(gameId);

    expect(game.players.length).toBe(4);
    expect(game.gameStastus).toBe(GameStatus.ImpostorWin);
});

async function seedData() {
    await testContext.databaseSetup;

    await testContext.addCrewMate(new CrewMateRow(0, "user 1"));
    await testContext.addCrewMate(new CrewMateRow(0, "user 2"));
    await testContext.addCrewMate(new CrewMateRow(0, "user 3"));
    await testContext.addCrewMate(new CrewMateRow(0, "user 4"));
}
