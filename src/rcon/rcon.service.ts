import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Rcon from 'ts-rcon';

@Injectable()
export class RconService {
  private rcon: Rcon;

  private readonly logger = new Logger(RconService.name);

  private commands: string[] = [];

  private authenticated = false;

  constructor(private eventEmitter: EventEmitter2) {
    this.rcon = new Rcon(
      process.env.RCON_HOST,
      Number(process.env.RCON_PORT),
      process.env.RCON_PASSWORD,
      {
        challenge: false,
        tcp: false,
      },
    );

    this.rcon
      .on('auth', () => this.onAuth())
      .on('error', (error) => this.onError(error))
      .on('response', (response) => this.onResponse(response))
      .on('end', () => this.onEnd());
  }

  connect() {
    this.rcon.connect();
  }

  request(command: string) {
    this.commands.push(command);
    this.rcon.send(command);
  }

  onAuth() {
    this.logger.log('Connected to RCON')
    this.authenticated = true;
  }

  onError(error: Error) {
    this.logger.error(error);
  }

  onResponse(response) {
    const command = this.commands.shift();

    if (typeof command !== 'undefined') {
      this.eventEmitter.emit(`rcon.${command.split(' ').shift()}`, response);
    }
  }

  onEnd() {
    this.logger.error('Connection to RCON closed');

    setTimeout(() => {
      this.connect();
    }, 5000);
  }
}
