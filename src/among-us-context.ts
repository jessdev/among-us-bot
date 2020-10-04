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
            this.database.run("CREATE TABLE IF NOT EXISTS crewMateType(id INTEGER PRIMARY KEY, type TEXT)", this.handleError(reject, () =>{
                this.database.run("CREATE TABLE IF NOT EXISTS crewMate(id INTEGER PRIMARY KEY AUTOINCREMENT, discord TEXT)", this.handleError(reject, () => {
                    this.database.run("CREATE TABLE IF NOT EXISTS deathType(id INTEGER PRIMARY KEY, type TEXT)", this.handleError(reject, () => {
                        this.database.run("CREATE TABLE IF NOT EXISTS game(id INTEGER PRIMARY KEY AUTOINCREMENT, winnerTypeId INTEGER)", this.handleError(reject, () => { 
                            this.database.run("CREATE TABLE IF NOT EXISTS participant(id INTEGER PRIMARY KEY AUTOINCREMENT, gameId INTEGER, crewmateId INTEGER, deathtypeId INTEGER)", this.handleError(reject, () => { 
                                resolve();
                            }));
                        }));
                    }));
                }));
            }));
        });
    }

    /* Game Region */

    public async addGame(game: GameRow): Promise<number> {
        return await new Promise((resolve, reject) => {
            this.database.run('INSERT INTO game(WinnerTypeId) VALUES (?)', [game.winnderTypeId], 
                this.handleError(reject, (nullResponse: any) => {
                    this.database.get("SELECT last_insert_rowid()", this.handleError(reject, (data: any) => {
                        resolve(data['last_insert_rowid()']);
                    }));
            }));
        });
    }

    /* END Game Region */
    
    /* Participant Region */

    public async addPlayer(participant: ParticipantRow): Promise<void> {
        return await new Promise((resolve, reject) => {
            this.database.run('INSERT INTO participant(gameId, crewmateId, deathtypeId) VALUES (?, ?, ?)', 
                [participant.gameId, participant.crewmateId, participant.deathTypeId], 
                this.handleError(reject, () => { resolve(); }));
        });
    }

    /* END Participant Region */

    /* CrewMate Region */

    public async registerUser(userName: string): Promise<CrewMateRow> {
        return await new Promise(async (resolve, reject) => {
            var user = await this.getUser(userName);
            if(user.discord === null || user.discord === undefined) { 
                this.database.run('INSERT INTO crewMate(discord) VALUES (?)', [userName], 
                    this.handleError(reject, async ()=>{
                        const result = await this.getUser(userName);
                        resolve(result as CrewMateRow);
                }));
            }
        });
    }

    public async addCrewMate(crewmate: CrewMateRow): Promise<void> {
        return await new Promise(async (resolve, reject) => {
            this.database.run('INSERT INTO crewMate(discord) VALUES (?)', [crewmate.discord], this.handleError(reject, async (data: any) => {
                resolve();
            }))
        });
    }

    public async getUser(discord: string): Promise<CrewMateRow> {
        return await new Promise((resolve, reject) => {
            let sql = "SELECT id, discord from crewMate where discord = ?"
            this.database.get(sql, discord,
                this.handleError(reject, (data: CrewMateRow) => {
                    console.log(data)
                    if(data !== undefined && data !== null) {
                        resolve(data);
                        return;
                    }
                    reject();
                })
            );
        });
    }

    public async getAllCrewMates(): Promise<CrewMateRow[]> {
        return await new Promise((resolve, reject) => {
            let sql = "SELECT id, discord from crewMate";
            this.database.all(sql, this.handleError(reject, (data: CrewMateRow[]) => {
                resolve(data);
                return;
            }));
        });
    }

    /* END CrewMate Region */

    private handleError(reject: (reason?: any) => void, callback: Function) {
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
