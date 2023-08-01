import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { RconService } from '../rcon/rcon.service';

@Injectable()
export class RestartWarningService {
  private readonly logger = new Logger(RestartWarningService.name);

  constructor(private rcon: RconService) {}

  @Cron('59 5,11,17,23 * * *', {
    timeZone: 'Europe/Amsterdam',
  })
  private broadCast1minute() {
    this.broadcastRestartWarning(1);
  }

  @Cron('55 5,11,17,23 * * *', {
    timeZone: 'Europe/Amsterdam',
  })
  private broadCast5minutes() {
    this.broadcastRestartWarning(5);
  }

  @Cron('50 5,11,17,23 * * *', {
    timeZone: 'Europe/Amsterdam',
  })
  private broadCast10minutes() {
    this.broadcastRestartWarning(10);
  }

  @Cron('45 5,11,17,23 * * *', {
    timeZone: 'Europe/Amsterdam',
  })
  private broadCast15minutes() {
    this.broadcastRestartWarning(15);
  }

  private broadcastRestartWarning(minutes: number) {
    this.logger.log(`Broadcasting restart warning: ${minutes} minutes`);

    this.rcon.request(
      `servermsg "the server is restarting in ${minutes} minutes, log off now!"`,
    );
  }
}
