import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PlayersService } from './players/players.service';
import { RconService } from './rcon/rcon.service';
import { DiscordService } from './discord/discord.service';
import { RestartWarningService } from './restart-warning/restart-warning.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    PlayersService,
    RconService,
    DiscordService,
    RestartWarningService,
  ],
})
export class AppModule {}
