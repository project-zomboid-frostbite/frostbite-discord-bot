import { Client, Events, GatewayIntentBits } from 'discord.js'
import Rcon from 'ts-rcon'
import dotenv from 'dotenv'

import { delay } from './util'
import { PlayerListService } from './services/PlayerList'

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

async function main() {
  const playerListService = new PlayerListService()
  playerListService.setResponseCallback((response) => {
    console.log(response)
  })

  while (true) {
    playerListService.request()
    await delay(1000 * 60)
  }
}

client.once(Events.ClientReady, main)

client.login(process.env.DISCORD_TOKEN)
