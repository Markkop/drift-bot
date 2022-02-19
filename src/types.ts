import { MessageEmbed } from 'discord.js'

export interface GuildConfig {
  id: string
  partyChannel: string
}

export type DefaultGuildConfig = {
  partyChannel: string
}

export type PartyActions = 'join' | 'leave'

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

export type CommandOptions = Record<string, string | number>

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

export type Ingredient = {
  name: string,
  count: number
}

export type CookingRecipe = {
  name: string,
  directions: string[],
  ingredients: Ingredient[],
  tiers: number[],
  effect: string[],
  youtube_url: string,
  created_item: number,
  type: string
}

export type Recipe = {
  name: string
  type: string,
  job: string,
  level?: string,
  instructions: string[],
  ingredients: Ingredient[],
  tiers?: number[]
  effect?: string[],
  stats?: Stats[],
  perks?: string[]
  rarity?: string,
  zen?: string,
  location?: string,
}

export type Perk = {
  name: string,
  effect: string,
  type: 'active' | 'passive',
  tier1?: string,
  tier2?: string,
  tier3?: string
}

export type ScrappedPerks = {
  introText: string,
  buffsAndStacksText: string,
  perks: Perk[]
}