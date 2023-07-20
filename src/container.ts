import { Container } from 'inversify'

import { PlayerListService } from './services/PlayerListService'
import { RconService } from './services/RconService'
import { RestartWarningService } from './services/RestartWarningService'

const container = new Container()
container.bind<PlayerListService>(PlayerListService).toSelf()
container.bind<RestartWarningService>(RestartWarningService).toSelf()
container.bind<RconService>(RconService).toSelf()

export { container }
