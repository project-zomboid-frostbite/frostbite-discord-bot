import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DiscordService } from './discord/discord.service';
import { RconService } from './rcon/rcon.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  app.get(DiscordService).login();
  app.get(RconService).connect();
}
bootstrap();
