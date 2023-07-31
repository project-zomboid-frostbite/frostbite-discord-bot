import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PlayersService } from './players/players.service';
import { RconService } from './rcon/rcon.service';
import { DiscordService } from './discord/discord.service';
import { RestartWarningService } from './restart-warning/restart-warning.service';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  providers: [
    PlayersService,
    RconService,
    DiscordService,
    RestartWarningService,
  ],
})
export class AppModule {}
