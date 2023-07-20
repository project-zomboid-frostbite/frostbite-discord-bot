import { injectable } from 'inversify'
import { Duration, DateTime } from 'luxon'

import { RconService } from './RconService'

@injectable()
export class RestartWarningService {
  private restarts = ['06:00', '12:00', '18:00', '24:00']

  constructor(private rcon: RconService) {}

  public invoke() {
    const restarts = this.restarts
      .map((restart) =>
        DateTime.fromISO(restart)
          .diff(DateTime.now().setZone('Europe/Amsterdam'))
          .toMillis(),
      )
      .filter((ms) => ms > 0)

    const nearest = Math.min(...restarts)

    this.rcon.request(
      `servermsg "the server is restarting in ${Duration.fromMillis(
        nearest,
      ).toFormat('mm')} minutes"`,
    )
  }
}
