import { exception } from "console";
import Discord, { DiscordAPIError, Message, Role } from "discord.js";
import { AmongUsService } from "./among-us-service";
import { GameStatus } from "./models/game-status";
import { CrewMateType, CrewMate, Game, DeathType } from "./models/model-index";

export class AmongUsBot {
  private currentGame: Game;
  private amongService: AmongUsService;

  constructor() {
    this.currentGame = new Game();
    this.amongService = new AmongUsService(process.env.DATABASE!);
  }

  /* User Functions */
  public async joinUser(message: Message) {
    if (this.currentGame.players.length !== undefined) {
      let role = await this.getRole(message);
      let user = message.member!.user.username;
      await message.member!.roles.add(role);
      this.currentGame.addPlayer(new CrewMate(user));
    }
    await message.react("👌");
  }

  public async joinUsers(message: Message) {
    let role = await this.getRole(message);
    console.log("update game members");
    let users = await this.getCallUsers(message);
    await this.assignRole(role, users);
    await message.react("👌");
  }

  public async leaveUser(message: Message) {
    if (this.currentGame.players.length !== undefined) {
        var username = await message.member!.user.username;
        let role = await this.getRole(message);
        await message.member!.roles.remove(role);
        this.currentGame.removePlayer(username);
      }
      await message.react("👌");
  }

  public async impostorUser(message: Message) {
    let username = message.member!.user.username;
    this.currentGame.playerWasImpostor(username);
    await message.react("👌");
  }

  public async crewmateUser(message: Message){
    let username = message.member!.user.username;
    this.currentGame.playerWasCrewMater(username);
    await message.react("👌");
  }

  public async userDied(message: Message) {
    var username = message.member!.user.username;
    this.currentGame.playerDied(username);
    await message.react("👌");
  }

  public async userVoted(message: Message) {
    var username = message.member!.user.username;
    this.currentGame.playerVoted(username);
    await message.react("👌");
  }

  public async userStatus(message: Message) {
    let username = message.member!.user.username;
    let user = this.currentGame.getPlayerByName(username);
    if(user.discordName !== undefined) {
        message.reply("You, a "+ CrewMateType[user.role]+", are currently "+ DeathType[user.status]);
    }
  }

  public async currentPlayers(message: Message) {
    await message.reply("The following players are in the game");
    this.currentGame.players.forEach((user) => {
      message.channel.send(user.discordName);
    });
  }

  public async resetRoles(message: Message) {
    let role = await this.getRole(message);
    let users = await this.getAmongMembers(message);
    await this.removeRole(role, users);
    await message.react("👌");
  }

  /* END User Functions */


  /* Game Functions */

  public async impostorWin(message: Message) {
    this.currentGame.impostorWin();
    await message.react("👌");
  }

  public async crewmateWin(message: Message) {
    this.currentGame.crewmateWin();
    await message.react("👌");
  }

  public async onGoing(message: Message) {
    this.currentGame.onGoing();
    await message.react("👌");
  }

  public async restartGame(message: Message) {
    this.currentGame.newGameWithSamePlayers();
    await message.react("👌");
  }

  public async refreshGame(message: Message) {
    this.currentGame = new Game();
    let users = await this.getAmongMembers(message);
    let role = await this.getRole(message);
    await this.removeRole(role, users);
    await message.react("👌");
  }

  public async StoreGame(message: Message) {
    let state = this.currentGame.gameIsReadyForStorage();
    if (state) {
      this.amongService.storeGame(this.currentGame);
      this.currentGame.newGameWithSamePlayers();
      await message.reply("Game has been saved. Starting new game with the same players.");
    } else {
      await message.reply(this.currentGame.findMissingData());
    }
  }

  /* END Game Functions */

  private async getRole(msg: Message): Promise<Discord.Role> {
    let role = await msg.guild!.roles.cache!.find((r) => r.name === "TheAmong");
    if (role === undefined) {
      throw exception("Could not find TheAmong role");
    }
    return role!;
  }

  private async getCallUsers(msg: Message): Promise<Discord.GuildMember[]> {
    let users = await msg.member!.voice.channel!.members;
    let guildMembers: Discord.GuildMember[] = [];
    users.forEach((user) => {
      guildMembers.push(user);
    });
    return guildMembers;
  }

  private async getAmongMembers(msg: Message): Promise<Discord.GuildMember[]> {
    let users = await msg.member!.voice.channel!.members;
    let guildMembers: Discord.GuildMember[] = [];
    users.forEach((user) => {
      if (user.roles.cache.find((r) => r.name === "TheAmong") !== undefined) {
        guildMembers.push(user);
      }
    });
    return guildMembers;
  }

  private async assignRole(role: Discord.Role, users: Discord.GuildMember[]): Promise<void> {
    users.forEach(async (user) => { 
      await user.roles.add(role);
    }); 
  }

  private async removeRole(role: Discord.Role, users: Discord.GuildMember[]): Promise<void> {
    users.forEach(async (user) => { 
      await user.roles.remove(role);
    }); 
  }

}
