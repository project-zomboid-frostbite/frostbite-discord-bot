import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import Rcon from 'ts-rcon'

@Injectable()
export class RconService {
  private rcon: Rcon

  private readonly logger = new Logger(RconService.name)

  private reconnectTries = 0

  private commands: string[] = []

  constructor(private eventEmitter: EventEmitter2) {
    this.rcon = new Rcon(
      process.env.RCON_HOST,
      Number(process.env.RCON_PORT),
      process.env.RCON_PASSWORD,
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

  connect() {
    this.rcon.connect()
  }

  request(command: string) {
    this.commands.push(command)
    this.rcon.send(command)
  }

  onAuth() {
    this.logger.log('Connected to RCON')
    this.reconnectTries = 0
  }

  onError(error: Error) {
    this.logger.error(error)

    if (this.reconnectTries > 0) {
      this.logger.debug(`Reconnecting after ${this.reconnectTimeout}ms`)
      this.reconnect()
    }
  }

  onResponse(response) {
    const command = this.commands.shift()

    if (typeof command !== 'undefined') {
      this.eventEmitter.emit(`rcon.${command.split(' ').shift()}`, response)
    }
  }

  onEnd() {
    this.logger.error('Connection to RCON closed')
    this.reconnect()
  }

  private reconnect() {
    setTimeout(() => {
      this.commands = []
      this.reconnectTries++
      this.connect()
    }, this.reconnectTimeout)
  }

  get reconnectTimeout() {
    return Math.pow(2, this.reconnectTries) * 1000 + Math.random()
  }
}
