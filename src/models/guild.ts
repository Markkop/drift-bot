/* istanbul ignore file */
import { Schema, model } from 'mongoose'
import { GuildConfig } from '../types'

const GuildConfigSchema = new Schema<GuildConfig>({
  id: {
    type: String,
    required: true
  },
  partyChannel: {
    type: String
  },
})

const GuildModel = model<GuildConfig>('Guild', GuildConfigSchema)
export default GuildModel
