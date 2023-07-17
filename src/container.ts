import { Container } from 'inversify'
import { Client } from 'discord.js'

import { PlayerListService } from './services/PlayerListService'
import { RconService } from './services/RconService'

const container = new Container()
container.bind<PlayerListService>(PlayerListService).toSelf()
container.bind<RconService>(RconService).toSelf()

export { container }
