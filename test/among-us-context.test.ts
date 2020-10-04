import { v4 as Guid} from "uuid";
import { AmongUsContext } from "../src/among-us-context";
import { CrewMateRow } from "../src/databaseModels/crewmate-row";
import { ParticipantRow } from "../src/databaseModels/database-index";
import { GameRow } from "../src/databaseModels/game-row";

const guid: string = Guid();
var testContext = new AmongUsContext(guid+".db");

const testCrewmateUsername = "TestName";

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
    let crew = new CrewMateRow(0, testCrewmateUsername);
    await testContext.addCrewMate(crew);
});

test('get crewmate', async () => {
    await testContext.databaseSetup;
    try {
        let result = await testContext.getUser(testCrewmateUsername);
        expect(result.discord).toBe(testCrewmateUsername);
    } catch (error) {
        console.log(error);
        throw error;
    }
});

test("get all crewmates", async () => {
    await testContext.databaseSetup;
    let results = await testContext.getAllCrewMates();
    expect(results.length).toBeGreaterThan(0);
});
