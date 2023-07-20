import { CronJob } from 'cron'
import { container } from './container'

import { PlayerListService } from './services/PlayerListService'
import { RestartWarningService } from './services/RestartWarningService'

export const playerListServiceJob = new CronJob('* * * * *', () => {
  container.get(PlayerListService).updatePlayers()
})

export const restarWarningServiceJob = new CronJob(
  '45,50,55,59 5,11,17,23 * * *',
  () => {
    container.get(RestartWarningService).invoke()
  },
)
