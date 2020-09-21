import Discord, { DiscordAPIError, Message } from "discord.js";
import { time } from "console";
import { AmongUsContext } from "./among-us-context";
import { Game } from "./databaseModels/game";
import { CrewMateType, CrewMate } from "./databaseModels/model-index";

const client = new Discord.Client();
let context = new AmongUsContext(process.env.DATABASE!);
let channel_name =  "General";
let channel_id = "754492183146659953";
let currentPlayers: CrewMate[] =[];

client.on("ready", () => {
  if (client.user != null && client.user.tag != null) {
    console.log(`Logged in as ${client.user.tag}!`);
  } else {
    console.log("not ready");
  }
});

client.on('message', async (message: Message) => { 
  if(message.content.includes("!channel")) {
    channel_name = message.content.split(" ")[1];
    console.log("set channel to " + channel_name);
  }
  await message.react("👌");
});

client.on('message', async (message: Message) => {
  if(message.content.includes("!update game members")){
    console.log("update game members");
    let users = await message.member!.voice.channel!.members;
    users!.forEach(async (user) => {
      let result = await context.registerUser(user.user.username);
      console.log(result);
      currentPlayers.push(result);
    });
    await message.react("👌");
  }
});

client.on('message', async (message: Message) => {
  if(message.content.includes("!current players")){
    console.log("current players");
    let userStrings = "";
    currentPlayers.forEach((user) => {
      userStrings += userStrings + user.discordId;
    });
    await message.reply(userStrings);
  }
});

client.login(process.env.DISCORD_TOKEN!);
