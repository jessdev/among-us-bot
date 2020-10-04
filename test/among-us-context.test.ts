import { v4 as Guid} from "uuid";
import { AmongUsContext } from "../src/among-us-context";
import { CrewMateRow } from "../src/databaseModels/crewmate-row";
import { ParticipantRow } from "../src/databaseModels/database-index";
import { GameRow } from "../src/databaseModels/game-row";
import { GameStatus } from "../src/models/game-status";
import { CrewMateType, DeathType } from "../src/models/model-index";

const guid: string = Guid();
var testContext = new AmongUsContext(guid+".db");

const testCrewmateUsername = "TestName";
const participant = new ParticipantRow(0, 1, 1, CrewMateType.CrewMember, DeathType.alive);

test("save game to database", async () => {
    await testContext.databaseSetup;
    var gamerow = new GameRow(0, GameStatus.CrewmateWin);
    var result = await testContext.addGame(gamerow);
    expect(result).toBe(1);
});

test("get game by id", async () => {
    await testContext.databaseSetup;
    var game = await testContext.getGame(1);
    expect(game.winnerTypeId).toBe(GameStatus.CrewmateWin);
});

test('save crewmate to database', async () => {
    await testContext.databaseSetup;
    let crew = new CrewMateRow(0, testCrewmateUsername);
    await testContext.addCrewMate(crew);
});

test("save participant to database", async () => {
    await testContext.databaseSetup;
    await testContext.addPlayer(participant);
});

test("get participant", async () => {
    await testContext.databaseSetup;
    let result = await testContext.getParticipant(1);
    expect(result.crewmateId).toBe(participant.crewmateId);
    expect(result.gameId).toBe(participant.gameId);
    expect(result.roleId).toBe(participant.roleId);
    expect(result.statusId).toBe(participant.statusId);
});

test("get participant by game id", async () => { 
    await testContext.databaseSetup;
    let results = await testContext.getParticipantByGameId(1);
    expect(results.length).toBe(1);
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
