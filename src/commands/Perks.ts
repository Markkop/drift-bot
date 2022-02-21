import { FinderCommand } from '@baseCommands'
import str from '@stringsLang'
import { GuildConfig, PartialEmbed, Perk, ScrappedPerks } from '@types'
import { Interaction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import mappings from '@utils/mappings'
const { perkTypeEmoji } = mappings
const equipmentPerks: ScrappedPerks = require('../../data/generated/perks.json')

export const commandData = () => {
  const builder = new SlashCommandBuilder()
  builder
    .setName('perks')
    .setDescription(str.perksCommandDescription)
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription(str.perksListCommandDescription))
    .addSubcommand(subcommand =>
      subcommand
        .setName('search')
        .setDescription(str.perksSearchCommandDescription)
        .addStringOption(option => option.setName('name').setDescription(str.perksNameCommandOptionDescription).setRequired(true)))

  return builder
}

export default class PerksCommand extends FinderCommand {
  constructor(interaction: Interaction, guildConfig: GuildConfig) {
    super(interaction, guildConfig)
  }

  public async execute(): Promise<void> {
    if (!this.interaction.isCommand()) return

    if (this.interaction.options.getSubcommand() === 'list') {
      const perksTextEmbed = this.mountPerksListEmbed()
      await this.send({ embeds: [perksTextEmbed] })
      return
    }

    const name = this.interaction.options.getString('name')

    const results = this.findMatchingPerksByName(name)
    if (!results.length) {
      this.returnNotFound()
      return
    }

    const trimmedResults = results.filter(result => result.name)
    const perkEmbed = this.mountPerkEmbed(trimmedResults as Perk[])
    await this.send({ embeds: [perkEmbed] })
  }

  private mountPerksListEmbed(): PartialEmbed {
    const perksEmbed: PartialEmbed = {
      url: 'https://zenithmmo.fandom.com/wiki/Equipment_Perks',
      thumbnail: {
        url: 'https://i.imgur.com/o2WSFJ9.png'
      },
      title: 'Equipment Perks',
      description: equipmentPerks.introText,
      fields: [
        {
          name: ':fire: Buffs And Stacks',
          value: equipmentPerks.buffsAndStacksText,
          inline: false
        },
        {
          name: `${perkTypeEmoji.passive} Passive Perks`,
          value: equipmentPerks.perks.filter(perk => perk.type === 'passive').map(perk => perk.name).join(', '),
          inline: false
        },
        {
          name: `${perkTypeEmoji.active} Active Perks`,
          value: equipmentPerks.perks.filter(perk => perk.type === 'active').map(perk => perk.name).join(', '),
          inline: false
        },
      ]
    }

    return perksEmbed
  }

  private findMatchingPerksByName(name: string) {
    const matchingPerks = equipmentPerks.perks.filter((perk: Perk) => perk.name.toLowerCase().includes(name.toLowerCase()))
    return matchingPerks
  }

  private mountPerkEmbed(results: Perk[]): PartialEmbed {
    const firstResult = results[0]
    const typeEmoji = perkTypeEmoji[firstResult.type]
    const perkEmbed: PartialEmbed = {
      title: `${typeEmoji} ${firstResult.name}`,
      description: str.contributeToWiki,
      fields: [
        {
          name: str.capitalize(str.type),
          value: str.capitalize(firstResult.type),
          inline: true
        },
        {
          name: str.capitalize(str.effects),
          value: firstResult.effect || 'Uknown',
          inline: true
        },
      ]
    }

    const hasTier = Boolean(firstResult.tier1)
    if (hasTier) {
      perkEmbed.fields.push({
        name: str.capitalize(str.tiers),
        value: `Tier 1: ${firstResult.tier1}\nTier 2: ${firstResult.tier2}\nTier 3: ${firstResult.tier3}`,
        inline: false
      })
    }

    const perksFoundText = this.getTruncatedResults(results, 20, false, false)
    if (results.length > 1) {
      perkEmbed.footer = {
        text: `${str.capitalize(str.perksFound)}: ${perksFoundText}`
      }
    }

    return perkEmbed
  }
}
