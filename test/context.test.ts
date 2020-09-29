import { v4 as Guid} from "uuid";
import { AmongUsContext } from "../src/among-us-context";
import { CrewMateRow } from "../src/databaseModels/crewmate-row";
import { ParticipantRow } from "../src/databaseModels/database-index";
import { GameRow } from "../src/databaseModels/game-row";

const guid: string = Guid();
var testContext = new AmongUsContext(guid+".db");

test('save game to database', async () => {
    await testContext.databaseSetup;
    try {
        var gamerow = new GameRow(0, 0);
        var result = await testContext.addGame(gamerow);
        expect(result).toBe(1);
    } catch(error) {
        console.log(error);
        throw error;
    }
});

test('save crewmate to database', async () => {
    await testContext.databaseSetup;
    try {
        let discord = "test";
        let crew = new CrewMateRow(0, discord);
        var result = await testContext.addCrewMate(crew);
        expect(result).toBe(undefined);
    } catch (error) {
        console.log(error);
        throw error;
    }
});

test('get crewmate', async () => {
    await testContext.databaseSetup;
    try {
        let discord = "testUser";
        let crew = new CrewMateRow(0, discord);
        await testContext.addCrewMate(crew);
        let result = await testContext.getUser(discord);
        expect(result.discordId).toBe(discord);
    } catch (error) {
        console.log(error);
        throw error;
    }
});
