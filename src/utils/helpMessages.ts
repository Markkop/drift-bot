export default {
  equip: {
    help: 'Search by equipment name and / or rarity',
    examples: [
      '/equip name: galian',
      '/equip name: hardened rarity: unique'
    ]
  },
  about: {
    help: 'Displays information about this bot',
    examples: ['/about']
  },
  "party-create": {
    help: 'Create party groups to recruite other players for dungeons and events. \nPlayers can join and leave the party by reacting to emojis',
    examples: [
      '/party-create name: Cooking contest',
      "/party-create name: Pirate King description: If it's your first time, it's okay date: Tomorrow 8PM level: 40 slots: 10"
    ]
  },
  "party-update": {
    help: 'Change details for a group listing whose leader is you',
    examples: [
      '/party-update id: 20 date: 02/04/2020 '
    ]
  },
  recipe: {
    help: 'See recipes.',
    examples: [
      '/recipe name: brakmar sword',
      '/recipe name: espada de brakmar lang: pt',
      '/recipe name: peace pipe rarity: mythical',
      '/recipe name: o eterno rarity: mítico lang: pt'
    ]
  },
  config: {
    help: "Change some of this bot's configuration for your guild. You need admin permission for this.",
    examples: [
      '/config get',
      '/config set party-channel: #party-listing',
    ]
  }
}
