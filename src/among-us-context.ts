import sqlite3 from "sqlite3";
import { Game, CrewMateType, CrewMate } from "./databaseModels/model-index";
import { resolve } from "path";

export class AmongUsContext {
    private database: sqlite3.Database
    constructor(databaseFileName: string) {
        console.log(databaseFileName);
        this.database = new sqlite3.Database(databaseFileName);
        this.database.run("CREATE TABLE IF NOT EXISTS CrewMateType(Id INTEGER PRIMARY KEY, Type TEXT)");
        this.database.run("CREATE TABLE IF NOT EXISTS CrewMate(Id INTEGER PRIMARY KEY AUTOINCREMENT, DiscordId TEXT)");
        this.database.run("CREATE TABLE IF NOT EXISTS DeathType(Id INTEGER PRIMARY KEY, Type TEXT)");
        this.database.run("CREATE TABLE IF NOT EXISTS Game(Id INTEGER PRIMARY KEY AUTOINCREMENT, WinnerTypeId INTEGER)");
        this.database.run("CREATE TABLE IF NOT EXISTS Participant(Id INTEGER PRIMARY KEY AUTOINCREMENT, GameId INTEGER, CrewMateId INTEGER, DeathTypeId INTEGER)");
    }

    public async addGame(game: Game): Promise<number> {
        return await new Promise((resolve, reject) => {
            this.database.run('INSERT INTO Game(WinnerTypeId) VALUES (?)', [game.winnerType.id], (error: any, data: any) => {
                this.database.all('FROM Game SELECT last_insert_rowid()', (error: any, data: any)=> { 
                    if(error){
                        reject(error);
                    }
                    resolve(data[0]["last_insert_rowid()"]);
                });
            });
        });
    }

    public async registerUser(userName: string): Promise<CrewMate> {
        return await new Promise(async (resolve, reject) => {
            var user = await this.getUser(userName);
            if(user.discordId === null || user.discordId === undefined) { 
                this.database.run('INSERT INTO CrewMate(DiscordId) values (?)', userName, this.resolvePromise(reject, async ()=>{
                    const result = await this.getUser(userName);
                    resolve(result as CrewMate);
                }));
            }
        });
    }

    public async getUser(discord: string): Promise<CrewMate> {
        return await new Promise((resolve, reject) => {
            this.database.run("SELECT * From CrewMate Where DiscordId = '?'", 
                discord, 
                this.resolvePromise(reject, (data:any) => {
                    try{
                        console.log(data);
                        if(data === undefined){
                            resolve({} as CrewMate);
                        }
                        if(data.length > 0){
                            resolve(new CrewMate(data[0].Id, data[0].DiscordId));
                        }
                        resolve({} as CrewMate);
                    } catch {
                        resolve({} as CrewMate);
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
