import Rcon from 'ts-rcon'

import { delay } from '../util'

type ResponseCallback = (response: string) => void

export class PlayerListService {
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
      .on('error', () => this.onError())
      .on('response', (response) => this.onResponse(response))
      .on('end', () => this.onEnd())

    this.rcon.connect()
  }

  request() {
    if (this.ready) {
      this.rcon?.send('players')
    }
  }

  setResponseCallback(callback: ResponseCallback) {
    this.callback = callback
  }

  onAuth() {
    this.ready = true
    this.rcon?.send('players')
  }

  onError() {
    this.connectionRetries += 1

    if (this.connectionRetries <= 3) {
      delay(1000).then(() => this.rcon?.connect())
    }
  }

  onResponse(response: string) {
    if (this.callback) {
      this.callback(response)
    }
  }

  onEnd() {
    // goodbye!
  }
}
