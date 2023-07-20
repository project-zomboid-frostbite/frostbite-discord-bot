import { injectable } from 'inversify'
import Rcon from 'ts-rcon'
import { delay } from '../util'

type ResponseCallback = (response: string) => void

@injectable()
export class RconService {
  private rcon: Rcon | null = null

  private connectionRetries = 0

  private callback: ResponseCallback | null = null

  private command: string | null = null

  constructor() {
    this.rcon = new Rcon(
      process.env.RCON_HOST!,
      Number(process.env.RCON_PORT),
      process.env.RCON_PASSWORD!,
      {
        challenge: false,
        tcp: false,
      },
    )

    this.rcon
      .on('auth', () => this.onAuth())
      .on('error', (error) => this.onError(error))
      .on('response', (response) => this.onResponse(response))
      .on('end', () => this.onEnd())
  }

  request(command: string) {
    this.command = command
    this.rcon?.connect()
  }

  setResponseCallback(callback: ResponseCallback) {
    this.callback = callback
  }

  onAuth() {
    if (this.command) {
      this.rcon?.send(this.command)
    }
  }

  onError = console.error

  async onResponse(response: string) {
    if (this.callback && response.length > 0) {
      this.callback(response)
    }

    await delay(300)
    this.rcon?.disconnect()
  }

  onEnd() {
    // goodbye!
  }
}
