import sqlite3 from "sqlite3";
import { CrewMateRow, GameRow, ParticipantRow } from "./databaseModels/database-index";

export class AmongUsContext {
    private database: sqlite3.Database
    constructor(databaseFileName: string) {
        console.log(databaseFileName);
        this.database = new sqlite3.Database(databaseFileName);
        this.database.run("CREATE TABLE IF NOT EXISTS crewMateType(id INTEGER PRIMARY KEY, type TEXT)");
        this.database.run("CREATE TABLE IF NOT EXISTS crewMate(id INTEGER PRIMARY KEY AUTOINCREMENT, discord TEXT)");
        this.database.run("CREATE TABLE IF NOT EXISTS deathType(id INTEGER PRIMARY KEY, type TEXT)");
        this.database.run("CREATE TABLE IF NOT EXISTS game(id INTEGER PRIMARY KEY AUTOINCREMENT, winnerTypeId INTEGER)");
        this.database.run("CREATE TABLE IF NOT EXISTS participant(id INTEGER PRIMARY KEY AUTOINCREMENT, gameId INTEGER, crewmateId INTEGER, deathtypeId INTEGER)");
    }

    public async addGame(game: GameRow): Promise<number> {
        return await new Promise((resolve, reject) => {
            this.database.run('INSERT INTO game(WinnerTypeId) VALUES (?)', [game.winnderTypeId], (error: any, data: any) => {
                this.database.all('FROM game SELECT last_insert_rowid()', (error: any, data: any)=> { 
                    if(error){
                        reject(error);
                    }
                    resolve(data[0]["last_insert_rowid()"]);
                });
            });
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

    public async getUser(discord: string): Promise<CrewMateRow> {
        return await new Promise((resolve, reject) => {
            this.database.run("SELECT * From CrewMate Where discord = '?'", 
                discord, 
                this.resolvePromise(reject, (data:any) => {
                    try{
                        console.log(data);
                        if(data === undefined){
                            resolve({} as CrewMateRow);
                        }
                        if(data.length > 0){
                            resolve(new CrewMateRow(data[0].Id, data[0].discordId));
                        }
                        resolve({} as CrewMateRow);
                    } catch {
                        resolve({} as CrewMateRow);
                    }
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
