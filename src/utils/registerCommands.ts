import { REST } from "@discordjs/rest";
import { GuildConfig } from "@types";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import commandsData from "../commands";
import { SlashCommandBuilder, SlashCommandSubcommandBuilder} from '@discordjs/builders'
import mappings from '@utils/mappings'
const { rarityMap } = mappings

export function addStringOptionWithRarityChoices(
  builder: SlashCommandBuilder|SlashCommandSubcommandBuilder, 
  name: string, description: string, 
  rarityNames?: string[]
  ) {
  let rarities = rarityNames ? rarityNames : Object.keys(rarityMap)
  return builder.addStringOption(option => {
      option.setName(name).setDescription(description)
      rarities.forEach(rarity => option.addChoice(rarity, rarity))
      return option
    })
}

export async function registerCommands (
  client: Client, 
  guildId: string, 
  guildName: string) {
  try {
    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_BOT_TOKEN);
    const commandData = commandsData.map((commandData) => {
      if (typeof commandData === 'function') {
        const data = commandData()
        return data.toJSON()

      }
      return commandData.toJSON()
    });
  
    await rest.put(
      Routes.applicationGuildCommands(client.user?.id || "missing id", guildId),
      { body: commandData }
    );
  
  } catch (error) {
    if (error.rawError?.code === 50001) {
      console.log(`Missing Access on server "${guildName}"`)
      return
    }
    console.log(error)
  } 
};
