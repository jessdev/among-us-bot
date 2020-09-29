import { exception } from "console";
import Discord, { DiscordAPIError, Message, Role } from "discord.js";
import { AmongUsService } from "./among-us-service";
import { AmongUsBot } from "./among-us-bot";
import { GameStatus } from "./models/game-status";
import { CrewMateType, CrewMate, Game, DeathType } from "./models/model-index";

const client = new Discord.Client();
const amongUsBot = new AmongUsBot();

client.on("message", async (message: Message) => {
  if (includesContent(message.content, ["!join"])) {
    await amongUsBot.joinUser(message);
  } 
  else if (includesContent(message.content, ["!leave"])) {
    await amongUsBot.leaveUser(message);
  } 
  else if (includesContent(message.content, ["!impostor"])) {
    await amongUsBot.impostorUser(message);
  } 
  else if (includesContent(message.content, ["!crewmate"])) {
    await amongUsBot.crewmateUser(message);
  } 
  else if (includesContent(message.content, ["!died"])) {
    await amongUsBot.userDied(message);
  } 
  else if (includesContent(message.content, ["!voted"])) {
    await amongUsBot.userVoted(message);
  }
  else if (includesContent(message.content, ["!status"])) {
    await amongUsBot.userStatus(message);
  }
  else if (includesContent(message.content, ["!register"])) {
    await amongUsBot.joinUsers(message);
  }
  else if (includesContent(message.content, ["!current players"])) {
    await amongUsBot.currentPlayers(message);
  }
});

client.on("message", async (message: Message) => {
  if (includesContent(message.content, ["!win impostor"])) {
    amongUsBot.impostorWin(message);
  }
  else if (includesContent(message.content, ["!win crewmate"])) {
    amongUsBot.crewmateWin(message);
  }
  else if (includesContent(message.content, ["!ongoing game"])){
    amongUsBot.onGoing(message);
  }
});

client.on("message", async (message: Message) => {
  if (includesContent(message.content, ["!refresh"])) {
    amongUsBot.refreshGame(message);
  } 
  else if(includesContent(message.content, ["!restart"])){
    await amongUsBot.restartGame(message);
  }
  else if (includesContent(message.content, ["!store"])) {
    await amongUsBot.StoreGame(message);
  } 
  else if (includesContent(message.content, ["!resetrole"]) && message.guild !== null) {
    await amongUsBot.resetRoles(message);
  }
});

client.on("message", async (message: Message) => {
  if (includesContent(message.content, ["pog", "orange"])) {
    await message.react("👌");
  }
});

client.login(process.env.DISCORD_TOKEN!);

function includesContent(message: string, matches: string[]): boolean {
  let isMessage = false;
  matches.forEach((item: string) => {
    if (message.toLocaleLowerCase().includes(item.toLowerCase())) {
      isMessage = true;
      console.log(item);
    }
  });
  return isMessage;
}
