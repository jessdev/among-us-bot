import Discord, { DiscordAPIError, Message } from "discord.js";
import { AmongUsService } from "./among-us-service";
import { CrewMateType, CrewMate, Game, DeathType } from "./models/model-index";

const client = new Discord.Client();
let service = new AmongUsService(process.env.DATABASE!);
let currentGame: Game = {} as Game;

client.on("ready", () => {
  if (client.user != null && client.user.tag != null) {
    console.log(`Logged in as ${client.user.tag}!`);
  } else {
    console.log("not ready");
  }
});

client.on('message', async (message: Message) => {
  if(includesContent(message.content, ["!start"])){
    currentGame = new Game();
    await message.react("👌");
  }
});

client.on('message', async (message: Message) => {
  if(includesContent(message.content, ["!register"])) {
    console.log("update game members");
    let users = await message.member!.voice.channel!.members;
    users!.forEach(async (user) => {
      let result = await service.registerUser(user.user.username);
    });
    await message.react("👌");
  }
});

client.on('message', async (message: Message) => {
  if(includesContent(message.content, ["!playing"])){
    if(currentGame.players.length !== undefined){
      var user = await message.member!.user.username;
      currentGame.addPlayer(new CrewMate(user));
    }
    await message.react("👌");
  }
});

client.on('message', async (message: Message) => {
  if(includesContent(message.content, ["!current players"])) {
    console.log("current players");
    let userStrings = "";
    currentGame.players.forEach((user) => {
      userStrings += userStrings + user.discordName;
    });
    await message.reply(userStrings);
    await message.react("👌");
  }
});

client.on('message', async (message: Message) => {
  if(includesContent(message.content, ["!status"])){
    var username = await message.member!.user.username;
    var user = currentGame.getPlayerByName(username);
    message.reply("you are currently "+ DeathType[user.status]);
  }
});

client.on('message', async (message: Message) => {
  if(includesContent(message.content, ["!died"])) {
    var username = await message.member!.user.username;
    currentGame.playerDied(username);
  }
});

client.on('message', async (message: Message) => {
  if(includesContent(message.content, ["!voted"])) {
    var username = await message.member!.user.username;
    currentGame.playerVoted(username);
  }
});

client.on('message', async (message: Message) => {
  if(includesContent(message.content, ["pog", "orange"])){
    await message.react("👌");
  }
});

client.login(process.env.DISCORD_TOKEN!);

function includesContent(message: string, matches: string []): boolean {
  let isMessage = false;
  matches.forEach((item: string) => { 
    if(message.toLocaleLowerCase().includes(item.toLowerCase())){
      isMessage = true;
    }
  });
  return isMessage;
}
