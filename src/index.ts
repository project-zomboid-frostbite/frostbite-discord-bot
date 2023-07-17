import 'reflect-metadata'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import Rcon from 'ts-rcon'
import dotenv from 'dotenv'

import { container } from './container'
import { delay } from './util'
import { PlayerListService } from './services/PlayerListService'
import { RconService} from './services/RconService'

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

async function main() {
  const rconService = new RconService()
  const playerListService = container.get(PlayerListService)
  //const playerListService = new PlayerListService(rconService)
  
  while (true) {
    playerListService.updatePlayers()
    await delay(1000)
  }
}

container.bind<Client>(Client).toDynamicValue(() => client)

client.once(Events.ClientReady, main)

client.login(process.env.DISCORD_TOKEN)
