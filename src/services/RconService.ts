import { injectable } from 'inversify'
import Rcon from 'ts-rcon'
import { delay } from '../util'


type ResponseCallback = (response: string) => void

@injectable()
export class RconService {
  private rcon: Rcon | null = null

  private connectionRetries = 0

  private ready = false

  private callback: ResponseCallback | null = null

  constructor() {
    this.rcon = new Rcon(process.env.RCON_HOST!, Number(process.env.RCON_PORT), process.env.RCON_PASSWORD!, {
      challenge: false,
      tcp: false,
    })

    this.rcon
      .on('auth', () => this.onAuth())
      .on('error', (error) => this.onError(error))
      .on('response', (response) => this.onResponse(response))
      .on('end', () => this.onEnd())

    this.rcon.connect()
  }

  request(command: string) {
    if (this.ready) {
      this.rcon?.send(command)
    }
  }

  setResponseCallback(callback: ResponseCallback) {
    this.callback = callback
  }

  onAuth() {
    this.ready = true
  }

  onError(error: string) {
    console.error(error)

    this.connectionRetries += 1

    if (this.connectionRetries <= 3) {
      delay(1000).then(() => this.rcon?.connect())
    }
  }

  onResponse(response: string) {
    console.log(response.length)
    if (this.callback) {
      this.callback(response)
    }
  }

  onEnd() {
    // goodbye!
  }
}
