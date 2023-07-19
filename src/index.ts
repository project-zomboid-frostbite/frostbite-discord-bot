import 'reflect-metadata'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'

import { container } from './container'
import { delay } from './util'
import { PlayerListService } from './services/PlayerListService'

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

async function main() {
  const playerListService = container.get(PlayerListService)

  while (true) {
    playerListService.updatePlayers()
    await delay(1000 * Number(process.env.MAIN_LOOP_INTERVAL ?? 60))
  }
}

container.bind<Client>(Client).toDynamicValue(() => client)

client.once(Events.ClientReady, main)

client.login(process.env.DISCORD_TOKEN)
