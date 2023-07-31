import { Injectable, Logger } from '@nestjs/common';
import { Client, Events, GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  private client: Client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  private ready = false;

  constructor() {
    this.client.once(Events.ClientReady, () => {
      this.logger.log('Connected to discord bot');
      this.ready = true;
    });
  }

  login() {
    this.client.login(process.env.DISCORD_TOKEN);
  }

  isReady() {
    return this.ready;
  }

  getClient() {
    return this.client;
  }
}
