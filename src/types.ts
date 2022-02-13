import { MessageEmbed } from 'discord.js'

export interface GuildConfig {
  id: string
  partyChannel: string
}

export type DefaultGuildConfig = {
  partyChannel: string
}

export type PartialEmbed = Partial<MessageEmbed>

export type Stats = Record<string, string>

export type ItemData = {
  name: string,
  location: string,
  rarity: string,
  level: string,
  className: string,
  slot: string,
  stats: Stats[],
  perks: string[],
  zen: string,
  components: string[]
}

export type JobDefintion = {
  id: number
  isArchive: boolean
  isNoCraft: boolean
  isHidden: boolean
  xpFactor: number
  isInnate: boolean
}

export type CommandOptions = Record<string, string|number>

export type CommandData = {
  args: string[],
  options: CommandOptions
}

export type PartyOptions = {
  name: string
  description: string
  date: string,
  level: string,
  slots: string
}
