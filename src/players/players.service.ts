import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { Interval } from '@nestjs/schedule'
import { EmbedBuilder, TextChannel, Message, ActivityType } from 'discord.js'

import { RconService } from '../rcon/rcon.service'
import { DiscordService } from '../discord/discord.service'

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name)

  private message: Message<true>

  private channel: TextChannel

  private players: string[] = []

  constructor(private rcon: RconService, private discord: DiscordService) {
    this.discord.getClient().on('ready', () => {
      this.fetchChannel().then(() => this.clearChannel())
    })
  }

  @Interval(60000)
  private updatePlayerList() {
    if (this.discord.isReady()) {
      this.rcon.request('players')
    }
  }

  async fetchChannel() {
    const channel = await this.discord
      .getClient()
      .channels.fetch(process.env.DISCORD_PLAYER_COUNT_CHANNEL_ID)

    if (channel instanceof TextChannel) {
      this.channel = channel
    }
  }

  async clearChannel() {
    if (this.channel) {
      this.channel.bulkDelete(1)
    }
  }

  @OnEvent('rcon.players')
  async onResponse(response: string) {
    this.players = response
      .split('\n')
      .splice(1)
      .map((player) => player.substring(1))

    this.logger.debug(`Updating player list (${this.players.length})`)

    this.discord.getClient().user?.setPresence({
      status: 'online',
      activities: [
        {
          type: ActivityType.Watching,
          name: `${this.players.length} survivor${
            this.players.length === 1 ? '' : 's'
          }`,
        },
      ],
    })

    const embed = new EmbedBuilder()
      .setColor(0x8bb7b4)
      .setTitle('Connected players')
      .setDescription(this.players.join('\n') || 'No players connected')
      .setImage(
        'https://media.discordapp.net/attachments/997930916280270889/1130581036670144613/gencraft_image_1684643526743.png',
      )
      .setTimestamp()
      .addFields({
        name: 'Total players connected',
        value: `${this.players.length}/32`,
      })
      .setFooter({ text: 'Bot made with ♥ by the Frostbite team' })

    if (this.channel) {
      if (this.message) {
        this.message.edit({ embeds: [embed] })
      } else {
        this.message = await this.channel.send({ embeds: [embed] })
      }
    }
  }
}
