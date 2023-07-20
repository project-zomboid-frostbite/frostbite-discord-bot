import { CronJob } from 'cron'
import { container } from './container'

import { PlayerListService } from './services/PlayerListService'
import { RestartWarningService } from './services/RestartWarningService'

export const playerListServiceJob = new CronJob('0/2 * * * *', () => {
  container.get(PlayerListService).updatePlayers()
})

export const restartWarningServiceJob = new CronJob(
  '45,50,55,59 5,11,17,23 * * *',
  () => {
    container.get(RestartWarningService).invoke()
  },
)
