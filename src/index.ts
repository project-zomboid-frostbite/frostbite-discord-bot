import 'reflect-metadata'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'

import { container } from './container'
import { playerListServiceJob, restarWarningServiceJob } from './cronjobs'

dotenv.config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

async function main() {
  restarWarningServiceJob.start()
  playerListServiceJob.start()
}

container.bind<Client>(Client).toDynamicValue(() => client)

client.once(Events.ClientReady, main)

client.login(process.env.DISCORD_TOKEN)
