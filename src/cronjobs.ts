import { CronJob } from 'cron'
import { container } from './container'

import { PlayerListService } from './services/PlayerListService'

export const playerListServiceJob = new CronJob('* * * * *', () =>
  container.get(PlayerListService).updatePlayers(),
)
