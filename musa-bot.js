/**
 * Musa Bot — Educational /price command (BRETT trade-only)
 * No farming, no backing — shows Aerodrome DEX price only
 */

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const ZRT_ADDRESS = process.env.ZRT_ADDRESS || "0x...pending";

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.content === '/price' || message.content === '!price') {
    // TODO: fetch from Aerodrome after deployment
    await message.reply(
      `**ZarTATO (ZRT) — Educational Token**\n` +
      `Price: DEX-driven on Aerodrome (trade-only)\n` +
      `Supply: 1B fixed, no mint\n` +
      `CA: ${ZRT_ADDRESS}\n` +
      `_Not financial advice. Educational experiment._`
    );
  }
});

client.once('ready', () => {
  console.log(`Musa Bot ready as ${client.user.tag}`);
});

// client.login(process.env.DISCORD_TOKEN);

module.exports = client;