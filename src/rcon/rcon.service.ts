import { Injectable } from '@nestjs/common';
import Rcon from 'ts-rcon';

type ResponseCallback = (response: string) => void;

@Injectable()
export class RconService {
  private rcon: Rcon | null = null;

  private connectionRetries = 0;

  private callback: ResponseCallback | null = null;

  private command: string | null = null;

  private keepAlive = true;

  private authenticated = false;

  constructor() {
    this.rcon = new Rcon(
      process.env.RCON_HOST!,
      Number(process.env.RCON_PORT),
      process.env.RCON_PASSWORD!,
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

    this.rcon.connect();
  }

  request(command: string) {
    if (this.authenticated) {
      this.rcon?.send(command);
    }
  }

  setResponseCallback(callback: ResponseCallback) {
    this.callback = callback;
  }

  onAuth() {
    this.authenticated = true;
  }

  onError = console.error;

  async onResponse(response: string) {
    if (this.callback && response.length > 0) {
      this.callback(response);
    }
  }

  onEnd() {
    // goodbye!
  }
}
