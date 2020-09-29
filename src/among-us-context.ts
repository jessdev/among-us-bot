import sqlite3 from "sqlite3";
import { CrewMateRow, GameRow, ParticipantRow } from "./databaseModels/database-index";

export class AmongUsContext {
    private database: sqlite3.Database;
    public databaseSetup: Promise<void> = new Promise((resolve, reject) => {/*intentionally left blank */});
    constructor(databaseFileName: string) {
        this.database = new sqlite3.Database(databaseFileName);
        this.databaseSetup = this.SetUp(databaseFileName);
    }

    public async SetUp(databaseFileName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.database.run("CREATE TABLE IF NOT EXISTS crewMateType(id INTEGER PRIMARY KEY, type TEXT)", this.resolvePromise(reject, () =>{
                this.database.run("CREATE TABLE IF NOT EXISTS crewMate(id INTEGER PRIMARY KEY AUTOINCREMENT, discord TEXT)", this.resolvePromise(reject, () => {
                    this.database.run("CREATE TABLE IF NOT EXISTS deathType(id INTEGER PRIMARY KEY, type TEXT)", this.resolvePromise(reject, () => {
                        this.database.run("CREATE TABLE IF NOT EXISTS game(id INTEGER PRIMARY KEY AUTOINCREMENT, winnerTypeId INTEGER)", this.resolvePromise(reject, () => { 
                            this.database.run("CREATE TABLE IF NOT EXISTS participant(id INTEGER PRIMARY KEY AUTOINCREMENT, gameId INTEGER, crewmateId INTEGER, deathtypeId INTEGER)", this.resolvePromise(reject, () => { 
                                resolve();
                            }));
                        }));
                    }));
                }));
            }));
        });
    }

    public async addGame(game: GameRow): Promise<number> {
        return await new Promise((resolve, reject) => {
            this.database.run('INSERT INTO game(WinnerTypeId) VALUES (?)', [game.winnderTypeId], this.resolvePromise(reject, (nullResponse: any) => {
                this.database.get("SELECT last_insert_rowid()", this.resolvePromise(reject, (data: any) => {
                    resolve(data['last_insert_rowid()']);
                }));
            }));
        });
    }

    public async addPlayer(participant: ParticipantRow): Promise<void> {
        return await new Promise((resolve, reject) => {
            this.database.run('INSERT INTO participant(gameId, crewmateId, deathtypeId) VALUES (?, ?, ?)', 
                [participant.gameId, participant.crewmateId, participant.deathTypeId], 
                this.resolvePromise(reject, () => { resolve(); }));
        });
    }

    public async registerUser(userName: string): Promise<CrewMateRow> {
        return await new Promise(async (resolve, reject) => {
            var user = await this.getUser(userName);
            if(user.discordId === null || user.discordId === undefined) { 
                this.database.run('INSERT INTO crewMate(discord) VALUES (?)', [userName], 
                    this.resolvePromise(reject, async ()=>{
                        const result = await this.getUser(userName);
                        resolve(result as CrewMateRow);
                }));
            }
        });
    }

    public async addCrewMate(crewmate: CrewMateRow) {
        return await new Promise(async (resolve, reject) => {
            this.database.run('INSERT INTO crewMate(discord) VALUES (?)', [crewmate.discordId], this.resolvePromise(reject, async (data: any) => {
                if(data !== undefined && data !== null) {
                    resolve(data);
                    return;
                }
                resolve();
            }))
        });
    }

    public async getUser(discord: string): Promise<CrewMateRow> {
        return await new Promise((resolve, reject) => {
            this.database.get("SELECT * From crewMate Where discord = '?name'", 
                {
                    $name: discord
                },
                this.resolvePromise(reject, (data:any) => {
                    if(data !== undefined && data !== null) {
                        resolve(data);
                        return;
                    }
                    reject();
            }));
        });
    }

    private resolvePromise(reject: (reason?: any) => void, callback: Function) {
        return (error: any, data: any) => {
            if(error){
                reject(error);
                console.log(error);
                return;
            }
            callback(data);
        }
    }
}
