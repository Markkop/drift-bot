export default {
  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  source: 'source',
  contributeToWiki: 'Contribute with new or updated information on [ZenithMMO Fandom Wiki](https://zenithmmo.fandom.com/wiki/Equipment_Perks)',
  perksFound: 'Perks found',
  perksCommandDescription: 'List and search for equipment perks',
  perksListCommandDescription: 'List equipment perks',
  perksSearchCommandDescription: 'Search for equipment perks by name',
  perksNameCommandOptionDescription: 'The perk name or part of it',
  synthesisInstructions: [
    "Walk up to the synthesis machine to open the synthesis menu.",
    "Choose the class, level, and item you wish to make.",
    "Press the green button on the right to start synthesis.",
    "Drag the items from the front of the machine onto the 3D blueprint above.",
  ],
  location: 'location',
  job: 'job',
  tiers: 'tiers',
  cost: 'cost',
  instructions: 'instructions',
  perks: 'perks',
  stats: 'stats',
  availableCommands: 'Available commands',
  examples: 'Exemples',
  commandOptionHelpCommandDescription: 'The command you wish to know more',
  helpCommandDescription: 'Get help with the bot features',
  recipeRarityCommandOptionDescription: 'The rarity of the recipe (if it has one)',
  recipeNameCommandOptionDescription: 'Name or part of a recipe name',
  recipeLevelCommandOptionDescription: 'Recipe level (if it has one)',
  recipeCommandDescription: 'Search by recipe name, rarity and level',
  equipRarityCommandOptionDescription: 'The rarity of the equipment',
  equipLevelCommandOptionDescription: 'Equipment level',
  equipNameCommandOptionDescription: 'Name or part of an equipment name',
  equipCommandDescription: 'Search by equipment name, rarity and level',
  partyUpdateCommandDescription: "Change a field in the group listing",
  partyIdCommandOptionDescription: "The group identification (ID) number",
  partySlotsCommandOptionDescription: "The number of slots available",
  partyLevelCommandOptionDescription: "The level or level range required to participate",
  partyDateCommandOptionDescription: "When the group will meet (in any format) ",
  partyDescriptionCommandOptionDescription: "Group description",
  partyNameCommandOptionDescription: "Group's name",
  partyCreateCommandDescription: 'Create a group listing on the configured channel',
  partyChannelConfigCommandOptionDescription: 'The channel will contain the group listings',
  setConfigCommandDescription: 'Change bot configuration',
  getConfigCommandDescription: 'View bot configuration',
  configCommandDescription: 'View or change bot configuration',
  aboutCommandDescription: 'Displays information about this bot',
  slots: 'slots',
  slot: 'slot',
  effects: 'effects',
  acquiring: 'acquiring',
  query: 'query',
  results: 'results',
  andOther: 'and other',
  level: 'level',
  type: 'type',
  rarity: 'rarity',
  equipped: 'equipped',
  inUse: 'in use',
  equipmentFound: 'equipment found',
  ingredients: 'ingredients',
  recipe: 'recipe',
  recipesFound: 'recipes found',
  party: 'party',
  noResults: 'No results',
  noResultsMessage: (command) => `Type \`.help ${command}\` to see some examples of how to search.`,
  monstersFound: 'Monsters found',
  aboutText: `**Drift** is a Discord bot that provides information about Zenith VR MMORPG.

  Use /help to find the command list and their usage examples.

  **Contribution:**
  It costs $7/month to keep this bot running 24/7 on [Heroku](https://www.heroku.com/pricing).  
  I'm currently using Github Education credits which will expire soon, so I'm counting on donations to have it working for the next months.
  If you have conditions and would like to help, please contribute <3

  Credit Card: 
  https://www.buymeacoffee.com/markkop

  Pix (Brazil only):
  me@markkop.dev

  I'm also accepting donations using cripto, just let me know which blockchain you'd like to use!

  Join the bot's discord server to get more help, report bugs and discover new features:
  https://discord.gg/qtATGySSQ4

  **Credits:**
  This project is open source and it's available on Github: [https://github.com/Markkop/pirate-king](https://github.com/Markkop/pirate-king)
  Author and maintaner: [Mark Kop](https://github.com/Markkop)
  The game Zenith and the graphics used in this bot belongs to RamenVR - all rights reserved.  
  This bot is an unnoficial project and doesn't have any connection with RamenVR.
  Most of the content used in this bot was retrivied from https://ez.community, so a huge thanks to them!
`
}