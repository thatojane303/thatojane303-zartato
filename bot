const { Client } = require('discord.js');
const client = new Client({ intents: [] });
client.on('interactionCreate', async i => {
  if(i.commandName === 'price') {
    await i.reply('ZRT price = Aerodrome DEX only - educational community token, no intrinsic value');
  }
});
client.login(process.env.DISCORD_TOKEN);