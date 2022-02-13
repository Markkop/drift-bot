import EquipCommand, { commandData as getCommandData } from '../src/commands/Equip'
import { executeCommandAndSpyReply, embedContaining, getParsedCommand } from './testutils'

describe('EquipmentCommand', () => {
  const commandData = getCommandData()
  it('return a matching equipment by name', async () => {
    const stringCommand = '/equip name: hardened chestplate'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      color: 9422818,
      title: '<:souvenir:888866409394864148> Hardened Chestplate',
      thumbnail: {
        url: 'https://ez.community/images/items/equipment/Hardened%20Chestplate-Unique.png'
      },
      fields: [
        {
          name: 'Level',
          value: "19",
          inline: true
        },
        {
          name: 'Slot',
          value: 'Chest',
          inline: true
        },
        {
          name: 'Rarity',
          value: 'Unique',
          inline: true
        },
        {
          name: 'Stats',
          value: 'Defense: 268\nPrimary Stat: 19',
          inline: false
        },
        {
          name: 'Perks',
          value: 'Brawler\nWarlock\nExemplar',
          inline: false
        },
      ],
      footer: {
        text: 'Equipment found: Hardened Chestplate [19] (Unique), Hardened Chestplate [17] (Uncommon), Hardened Chestplate [16] (Unique), Hardened Chestplate [14] (Uncommon), Hardened Chestplate [13] (Unique), Hardened Chestplate [11] (Uncommon)'
      }
    })
    )
  })

  it('return a matching equipment by name with higher and rarity level by default', async () => {
    const stringCommand = '/equip name: galian bodyplate'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Rarity',
        value: 'Unique',
        inline: true
      }])
    }))

    expect(spy).toHaveBeenCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Level',
        value: '35',
        inline: true
      }])
    }))
  })

  it('return a matching equipment by name and rarity with rarity option', async () => {
    const stringCommand = '/equip name: galian bodyplate rarity: uncommon'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Rarity',
        value: 'Uncommon',
        inline: true
      }])
    }))
  })

  it('return a matching equipment by name and level with level option', async () => {
    const stringCommand = '/equip name: galian legwraps level: 8'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      fields: expect.arrayContaining([{
        name: 'Level',
        value: '8',
        inline: true
      }])
    }))
  })

  it('return a footer with more equipment found if results are more than one', async () => {
    const stringCommand = '/equip name: hardened che'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      footer: {
        text: 'Equipment found: Hardened Chestplate [19] (Unique), Hardened Chestplate [17] (Uncommon), Hardened Chestplate [16] (Unique), Hardened Chestplate [14] (Uncommon), Hardened Chestplate [13] (Unique), Hardened Chestplate [11] (Uncommon)'
      }
    }))
  })

  it('return a footer with truncated results if there are too many', async () => {
    const stringCommand = '/equip name: a'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      footer: {
        text: "Equipment found: Ancient Plate [40] (Legendary), Ancient Greaves [40] (Legendary), Ancient Gauntlets [40] (Legendary), Ancient Legguards [40] (Legendary), Ultima Blade [40] (Legendary), Kitsune Wraps [40] (Legendary), Kitsune Pants [40] (Legendary), Ultima Launcher [40] (Legendary), Squire's Garb [40] (Epic), Initiate's Robes [40] (Epic), Initiate's Slippers [40] (Epic), Initiate's Wraps [40] (Epic), Initiate's Pants [40] (Epic), Dreadlord's Greaves [40] (Unique), Dreadlord's Mitts [40] (Unique), Dreadlord's Plate [40] (Unique), Dreadlord's Greaves [40] (Unique), Dreadlord's Mitts [40] (Unique), Dreadlord's Legguards [40] (Unique), Dreadlord's Blade [40] (Unique) and other 213 results"
      }
    }))
  })

  it('return a not found message if no equip was found', async () => {
    const stringCommand = '/equip name: asdasdasd'
    const command = getParsedCommand(stringCommand, commandData)
    const spy = await executeCommandAndSpyReply(EquipCommand, command)
    expect(spy).toHaveBeenLastCalledWith(embedContaining({
      color: 0xbb1327,
      description: 'Use `/help command: equip` to see some examples of how to search',
      title: ':x: No results'
    }))
  })
})
