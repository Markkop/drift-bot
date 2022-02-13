import { PartyReactionCommand } from '@baseCommands'
import { GuildConfig, PartyActions } from '@types'
import { Message, MessageReaction, User } from 'discord.js'
import mappings from '@utils/mappings'
const { classEmoji, roleEmoji } = mappings

export default class PartyReaction extends PartyReactionCommand {
  private className: string

  constructor (reaction: MessageReaction, user: User, guildConfig: GuildConfig) {
    super(reaction, user, guildConfig)
  }

  private getUserJoinedRow(members: string, user: User) {
    return members.split('\n').find(memberRow => memberRow.includes(user.id)) || ''
  }

  private getUserJoinedClass(memberRow: string): string {
    return memberRow.split('|')[1].split('(')[0]
  }

  private getUserJoinedRoles(memberRow: string): string[] {
    if (!memberRow.split('(')[1]) return []
    return memberRow.split('(')[1].split(')')[0].split(',').map(word => word.trim()).filter(Boolean)
  }

  private replaceUserSlotWithNextSlotAndResetLastSlot(partySlots: string[], userPartySlotIndex: number) {
    const newPartySlots = [ ...partySlots ]
    for (let index = userPartySlotIndex; index < partySlots.length; index++) {
      const nextPartySlot = partySlots[index + 1] || ''
      const nextPartySlotIsFullfulled = nextPartySlot.includes('@')
      if (nextPartySlotIsFullfulled) {
        newPartySlots[index] = nextPartySlot
      } else {
        newPartySlots[index] = ':small_orange_diamond:'
      }
    }
    return newPartySlots
  }

  private async joinPartyRole() {
    const partyMembers = this.getEmbedFieldValueByName(this.embed, 'Members')
    const isUserAlreadyMember = partyMembers.includes(this.user.id)
    if (!isUserAlreadyMember) return
    
    const memberRow = this.getUserJoinedRow(partyMembers, this.user)
    const hasAlreadyJoinedWithRole = memberRow.includes(this.className)
    if (hasAlreadyJoinedWithRole) return

    const memberRoles = this.getUserJoinedRoles(memberRow)
    const hasReachedMaxRolesJoin = memberRoles.length >= 3
    if (hasReachedMaxRolesJoin) return

    memberRoles.push(this.className)
    const newMemberRow = memberRoles.join(', ')
    const userClass = this.getUserJoinedClass(memberRow)
    const newPartyMembers = partyMembers.replace(memberRow, `:small_orange_diamond: <@${this.user.id}> | ${userClass} (${newMemberRow})`)
    const updatedEmbed = this.updatePartyFieldByName(this.embed, 'members', newPartyMembers)
    await this.editMessageEmbed(updatedEmbed)
  }

  private async leavePartyRole() {
    const partyMembers = this.getEmbedFieldValueByName(this.embed, 'Members')
    const memberRow = this.getUserJoinedRow(partyMembers, this.user)
    const hasJoinedWithRole = memberRow.includes(this.className)
    if (!hasJoinedWithRole) return

    const memberRoles = this.getUserJoinedRoles(memberRow)
    const newMemberRoles = memberRoles.filter(memberRole => memberRole !== this.className)
    const hasLeftWithAllRoles = newMemberRoles.length <= 0
    const userClass = this.getUserJoinedClass(memberRow)
    if (hasLeftWithAllRoles) {
      const newPartyMembers = partyMembers.replace(memberRow, `:small_orange_diamond: <@${this.user.id}> | ${userClass}`)
      const updatedEmbed = this.updatePartyFieldByName(this.embed, 'members', newPartyMembers)
      await this.editMessageEmbed(updatedEmbed)
      return
    }

    const newMemberRolesText = newMemberRoles.join(', ')
    const newPartyMembers = partyMembers.replace(memberRow, `:small_orange_diamond: <@${this.user.id}> | ${userClass} (${newMemberRolesText})`)
    const updatedEmbed = this.updatePartyFieldByName(this.embed, 'members', newPartyMembers)
    await this.editMessageEmbed(updatedEmbed)
  }

  private async joinPartyClass() {
    const partyMembers = this.getEmbedFieldValueByName(this.embed, 'Members')
    const isUserAlreadyMember = partyMembers.includes(this.user.id)
    if (isUserAlreadyMember) {
      const memberRow = this.getUserJoinedRow(partyMembers, this.user)
      const hasClassAlready = Boolean(this.getUserJoinedClass(memberRow).trim())
      if (hasClassAlready) return
      const newPartyMembers = partyMembers.replace(memberRow, `:small_orange_diamond: <@${this.user.id}> | ${this.className}`)
      const updatedEmbed = this.updatePartyFieldByName(this.embed, 'members', newPartyMembers)
      await this.editMessageEmbed(updatedEmbed)
      return
    }
    
    const partySlots = partyMembers.split('\n')
    const freeSlot = partySlots.find(slot => !slot.includes('@'))
    const freeSlotIndex = partySlots.indexOf(freeSlot)
    const hasFreeSlots = freeSlotIndex >= 0
    if (!hasFreeSlots) return

    partySlots[freeSlotIndex] = `:small_orange_diamond: <@${this.user.id}> | ${this.className}`
    const newPartySlots = partySlots.join('\n')
    const updatedEmbed = this.updatePartyFieldByName(this.embed, 'members', newPartySlots)
    await this.editMessageEmbed(updatedEmbed)
  }

  private async leavePartyClass() {
    const partyMembers = this.getEmbedFieldValueByName(this.embed, 'Members')
    const memberRow = this.getUserJoinedRow(partyMembers, this.user)
    const hasJoinedWithClass = memberRow.includes(this.className)
    if (!hasJoinedWithClass) return

    const partySlots = partyMembers.split('\n')
    const userPartySlot = partySlots.find(slot => slot.includes(this.user.id))
    const userPartySlotIndex = partySlots.indexOf(userPartySlot)
    const newPartySlots = this.replaceUserSlotWithNextSlotAndResetLastSlot(partySlots, userPartySlotIndex)
    const newPartyMembes = newPartySlots.join('\n')
    const updatedEmbed = this.updatePartyFieldByName(this.embed, 'members', newPartyMembes)
    await this.editMessageEmbed(updatedEmbed)
    return
  }

  public async execute (action: PartyActions): Promise<void> {
    const partyId = this.getPartyId(this.reaction.message as Message)
    if (!partyId) return

    const emojiString = `<:${this.reaction.emoji.name}:${this.reaction.emoji.id}>`
    const className = classEmoji[emojiString]
    const roleName = roleEmoji[emojiString]
    if (!className && !roleName) return

    this.className = emojiString

    if (className && action === 'join') {
      await this.joinPartyClass()
      return
    }

    if (className && action === 'leave') {
      await this.leavePartyClass()
      return
    }

    if (roleName && action === 'join') {
      await this.joinPartyRole()
      return
    }

    if (roleName && action === 'leave') {
      await this.leavePartyRole()
      return
    }
  }
}
