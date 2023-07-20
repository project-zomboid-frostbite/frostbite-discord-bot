import { injectable } from 'inversify'
import Rcon from 'ts-rcon'

type ResponseCallback = (response: string) => void

@injectable()
export class RconService {
  private rcon: Rcon | null = null

  private connectionRetries = 0

  private ready = false

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

  request(command: string, callback: ResponseCallback) {
    this.callback = callback
    this.command = command

    this.rcon?.connect()
  }

  onAuth() {
    if (this.command) {
      this.rcon?.send(this.command)
    }
  }

  onError = console.error

  onResponse(response: string) {
    if (this.callback) {
      this.callback(response)
    }
    this.rcon?.disconnect()
  }

  onEnd() {
    this.callback = null
    this.command = null
  }
}
