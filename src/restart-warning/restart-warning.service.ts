import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Duration, DateTime } from 'luxon';

import { RconService } from '../rcon/rcon.service';

@Injectable()
export class RestartWarningService {
  private readonly logger = new Logger(RestartWarningService.name);

  private readonly restarts = ['06:00', '12:00', '18:00', '24:00'];

  constructor(private rcon: RconService) {}

  @Cron('45,50,55,59 5,11,17,23 * * *', {
    timeZone: 'Europe/Amsterdam',
  })
  public invoke() {
    const restarts = this.restarts
      .map((restart) =>
        DateTime.fromISO(restart)
          .diff(DateTime.now().setZone('Europe/Amsterdam'))
          .toMillis(),
      )
      .filter((ms) => ms > 0);

    const nearest = Duration.fromMillis(Math.min(...restarts)).toFormat('mm');

    this.logger.log('Invoking restart warning', nearest);

    this.rcon.request(
      `servermsg "the server is restarting in ${Duration.fromMillis(
        nearest,
      ).toFormat('mm')} minutes"`,
    );
  }
}
