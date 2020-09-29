import { AmongUsContext } from "../src/among-us-context";
import { GameRow } from "../src/databaseModels/game-row";

var testContext = new AmongUsContext("testdatabase.db");

test('save game to database', async () => {
    try {
        var gamerow = new GameRow(0, 0);
        var result = await testContext.addGame(gamerow);
        expect(result).toBe(0);
    } catch(error) {
        console.log(error);
        throw error;
    }
});
