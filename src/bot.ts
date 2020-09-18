import Discord, { DiscordAPIError, Message } from "discord.js";
import { time } from "console";

const client = new Discord.Client();
let admins: string[] = [];

client.on("ready", () => {
  if (client.user != null && client.user.tag != null) {
    console.log(`Logged in as ${client.user.tag}!`);
  } else {
    console.log("not ready");
  }
});
