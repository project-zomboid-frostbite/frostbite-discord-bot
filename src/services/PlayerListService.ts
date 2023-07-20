import { Client, EmbedBuilder, TextChannel, Message, ActivityType } from 'discord.js'
import { injectable } from 'inversify'

import { RconService } from './RconService'

@injectable()
export class PlayerListService {
  private message: Message<true> | null = null

  private channel: TextChannel | null = null

  private players: string[] = []

  constructor(
    private client: Client,
    private rcon: RconService,
  ) {
    this.fetchChannel().then(() => this.clearChannel())
  }

  updatePlayers() {
    this.rcon.request('players', (response) => this.onResponse(response))
  }

  get playerCount() {
    return this.players.length
  }

  async fetchChannel() {
    const channel = await this.client.channels.fetch(
      process.env.DISCORD_PLAYER_COUNT_CHANNEL_ID!,
    )

    if (channel instanceof TextChannel) {
      this.channel = channel
    }
  }

  async clearChannel() {
    if (this.channel) {
      this.channel.bulkDelete(1)
    }
  }

  async onResponse(response: string) {
    this.players = response
      .split('\n')
      .splice(1)
      .map((player) => player.substring(1))

    this.client.user?.setPresence({
      status: 'online',
      activities: [
        {
          type: ActivityType.Watching,
          name: `${this.playerCount} survivor${
            this.playerCount === 1 ? '' : 's'
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
        value: `${this.playerCount}/32`,
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
